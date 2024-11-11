import * as THREE from 'three'

export default class IsometricMapControls extends THREE.EventDispatcher<{
    change: {}
}> {
    enabled: boolean = true
    readonly camera: THREE.OrthographicCamera
    readonly floorPlane: THREE.Plane

    zoomSpeed: number = 1
    minZoom: number = 0.5
    maxZoom: number = 2

    limitRadius: number = 50

    _camera0: THREE.Vector3
    _zoom0: number
    readonly _ray: THREE.Ray
    readonly _oz: number
    readonly _dx = new THREE.Vector3()
    readonly _dy = new THREE.Vector3()

    readonly _evCache: PointerEvent[] = []
    _pinchDiff: number = -1

    constructor(
        camera: THREE.OrthographicCamera,
        domElement: HTMLElement,
        floorPlane: THREE.Plane
    ) {
        super()

        this.camera = camera
        this.floorPlane = floorPlane

        this._camera0 = this.camera.position.clone()
        this._zoom0 = this.camera.zoom

        this._ray = new THREE.Ray()
        camera.getWorldDirection(this._ray.direction)

        this._oz = (camera.near + camera.far) / (camera.near - camera.far)

        this._calculateUnitVectors()
        window.addEventListener('resize', () => this._calculateUnitVectors())

        this._setupEvents(domElement)
    }

    _calculateUnitVectors() {
        const intersect0 = new THREE.Vector3()
        const intersectX = new THREE.Vector3()
        const intersectY = new THREE.Vector3()

        const setRayPos = (screenX: number, screenY: number) => {
            const ndcX = (2 * screenX) / window.innerWidth - 1
            const ndcY = -(2 * screenY) / window.innerHeight + 1

            this._ray.origin.set(ndcX, ndcY, this._oz).unproject(this.camera)
        }

        setRayPos(0, 0)
        this._ray.intersectPlane(this.floorPlane, intersect0)

        setRayPos(1, 0)
        this._ray.intersectPlane(this.floorPlane, intersectX)

        setRayPos(0, 1)
        this._ray.intersectPlane(this.floorPlane, intersectY)

        this._dx.subVectors(intersectX, intersect0)
        this._dy.subVectors(intersectY, intersect0)
    }

    getDistSquared() {
        const xz = new THREE.Vector2(
            this.camera.position.x - this._camera0.x,
            this.camera.position.z - this._camera0.z
        )

        return xz.lengthSq()
    }

    _limitDistance() {
        // Duplication :(
        const xz = new THREE.Vector2(
            this.camera.position.x - this._camera0.x,
            this.camera.position.z - this._camera0.z
        )

        const distSq = xz.lengthSq()
        if (distSq > this.limitRadius * this.limitRadius) {
            xz.normalize().multiplyScalar(this.limitRadius)

            this.camera.position.x = this._camera0.x + xz.x
            this.camera.position.z = this._camera0.z + xz.y
        }
    }

    _dist<P extends { x: number; y: number }>(p: P, q: P): number {
        const dx = q.x - p.x
        const dy = q.y - p.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    _zoomScale(delta: number) {
        return Math.pow(0.95, this.zoomSpeed * Math.abs(delta * 0.1))
    }

    _zoom(scale: number, direction: 'in' | 'out') {
        if (direction === 'in') {
            this.camera.zoom *= scale
        } else if (direction === 'out') {
            this.camera.zoom /= scale
        }

        this.camera.zoom = THREE.MathUtils.clamp(
            this.camera.zoom,
            this._zoom0 * this.minZoom,
            this._zoom0 * this.maxZoom
        )

        this.camera.updateProjectionMatrix()
        this._calculateUnitVectors()
        this._change()
    }

    _wheel(ev: WheelEvent) {
        ev.preventDefault()

        if (Math.abs(ev.deltaY) <= 0.001) {
            return
        }

        const scale = this._zoomScale(ev.deltaY / 10)
        const dir = ev.deltaY > 0 ? 'in' : 'out'
        this._zoom(scale, dir)
    }

    _pointerDown(ev: PointerEvent) {
        this._evCache.push(ev)
    }

    _pointerMove(ev: PointerEvent) {
        const index = this._evCache.findIndex(
            (cev) => cev.pointerId === ev.pointerId
        )

        switch (this._evCache.length) {
            case 1:
                const last = this._evCache[index]

                const dx = ev.x - last.x
                const dy = ev.y - last.y

                const moveX = this._dx.clone()
                moveX.multiplyScalar(dx)

                const moveY = this._dy.clone()
                moveY.multiplyScalar(dy)

                this.camera.position.sub(moveX)
                this.camera.position.sub(moveY)

                this._limitDistance()
                this._change()

                this._evCache[index] = ev
                break

            case 2:
                this._evCache[index] = ev

                const p0 = this._evCache[0]
                const p1 = this._evCache[1]

                const currDiff = this._dist(p0, p1)

                if (this._pinchDiff > 0) {
                    const delta = currDiff - this._pinchDiff

                    const scale = this._zoomScale(delta)
                    const dir = delta < 0 ? 'in' : 'out'

                    this._zoom(scale, dir)
                    this._change()
                }

                this._pinchDiff = currDiff

                break
        }
    }

    _pointerUp(ev: PointerEvent) {
        const index = this._evCache.findIndex(
            (cev) => cev.pointerId === ev.pointerId
        )
        this._evCache.splice(index, 1)

        if (this._evCache.length < 2) {
            this._pinchDiff = -1
        }
    }

    _setupEvents(elem: HTMLElement) {
        const wrap = <E>(cb: (e: E) => void) => {
            return (e: E) => {
                if (!this.enabled) return
                cb.bind(this)(e)
            }
        }
        elem.addEventListener('wheel', wrap(this._wheel), { passive: false })

        elem.addEventListener('pointerdown', wrap(this._pointerDown))
        elem.addEventListener('pointermove', wrap(this._pointerMove))

        elem.addEventListener('pointerup', wrap(this._pointerUp))
        elem.addEventListener('pointercancel', wrap(this._pointerUp))
        elem.addEventListener('pointerout', wrap(this._pointerUp))
        elem.addEventListener('pointerleave', wrap(this._pointerUp))
    }

    _change() {
        this.dispatchEvent({ type: 'change' })
    }
}
