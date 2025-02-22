<script>
    import * as THREE from 'three'
    import { T, useThrelte } from '@threlte/core'
    import { gsap } from 'gsap'
    import { ScrollTrigger } from 'gsap/ScrollTrigger'

    import appState from '$lib/appState.svelte'
    import { onNavigate } from '$app/navigation'

    const { invalidate, size } = useThrelte()

    const distance = 10
    const scrollScale = 0.5

    const maxTextLength = 10
    const textPadding = 1

    const width = maxTextLength + textPadding * 2
    const height = $derived(width * ($size.height / $size.width))

    /** @type {THREE.OrthographicCamera} */
    let camera
    /** @type {THREE.Vector3} */
    let cameraOrigin

    const downVec = new THREE.Vector3()

    const ray = new THREE.Ray()
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0))

    const setFrustum = () => {
        camera.left = -width / 2
        camera.right = width / 2
        camera.top = height / 2
        camera.bottom = -height / 2
    }

    const calculateDownVec = () => {
        const intersect0 = new THREE.Vector3()
        const intersectY = new THREE.Vector3()

        camera.getWorldDirection(ray.direction)
        const rayZ = (camera.near + camera.far) / (camera.near - camera.far)

        /**
         * @param {number} screenX
         * @param {number} screenY
         */
        const setRayPos = (screenX, screenY) => {
            const ndcX = (2 * screenX) / window.innerWidth - 1
            const ndcY = -(2 * screenY) / window.innerHeight + 1

            ray.origin.set(ndcX, ndcY, rayZ).unproject(camera)
        }

        setRayPos(0, 0)
        ray.intersectPlane(floorPlane, intersect0)

        setRayPos(0, 1)
        ray.intersectPlane(floorPlane, intersectY)

        downVec.subVectors(intersectY, intersect0)
        downVec.y = 0
    }

    const updateCamera = () => {
        setFrustum()
        camera.updateProjectionMatrix()
        calculateDownVec()
        invalidate()
    }

    /** @param {import("three").OrthographicCamera} ref */
    const oncreate = (ref) => {
        camera = ref
        camera.lookAt(0, 0, 0)

        const upAmount = 0.7

        // "center" the text, and move it upwards slightly (in viewport space)
        camera.position
            .add({ x: 0.5, y: 0, z: -0.5 })
            .add({ x: upAmount, y: 0, z: upAmount })

        cameraOrigin = camera.position.clone()

        const scroll = () => {
            if (appState.scrollTriggers.length !== 0) {
                return
            }

            const deltaPos = downVec
                .clone()
                .multiplyScalar(document.body.scrollTop * scrollScale)

            camera.position.addVectors(cameraOrigin, deltaPos)

            invalidate()
        }

        updateCamera()

        scroll()
        document.body.addEventListener('scroll', () => {
            scroll()
        })
    }

    const setupScrollTriggers = () => {
        const triggerConfigs = appState.scrollTriggers

        if (triggerConfigs.length === 0) {
            return
        }

        /** @type {gsap.core.Tween?} */
        let currentAnim = null

        const scroller = document.getElementById('scroller')

        const ctx = gsap.context(() => {
            for (const config of triggerConfigs) {
                const { target, trigger, ontoggle } = config

                const toPosition = cameraOrigin.clone().add(target)

                ScrollTrigger.create({
                    trigger,
                    scroller,
                    horizontal: true,
                    start: 'top center',
                    end: 'bottom center',
                    onToggle: ({ isActive }) => {
                        if (isActive) {
                            currentAnim?.kill()
                            currentAnim = gsap.to(camera.position, toPosition)
                        }
                        ontoggle && ontoggle(isActive)
                    },
                })
            }
        })

        return () => {
            ctx.kill()
        }
    }

    $effect(updateCamera)
    $effect(setupScrollTriggers)

    onNavigate(() => {
        gsap.to(camera.position, { ...cameraOrigin, overwrite: true })
    })
</script>

<T.OrthographicCamera makeDefault manual position={distance} {oncreate} />
