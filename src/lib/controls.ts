import * as THREE from "three";

export class IsoMapControls {
  enabled: boolean = true;
  readonly camera: THREE.OrthographicCamera;
  readonly floorPlane: THREE.Plane;

  zoomSpeed: number = 1;
  minZoom: number = 0.5;
  maxZoom: number = 2;

  readonly _ray: THREE.Ray;
  readonly _oz: number;
  readonly _dx = new THREE.Vector3();
  readonly _dy = new THREE.Vector3();

  readonly _evCache: PointerEvent[] = [];
  _pinchDiff: number = -1;

  constructor(
    camera: THREE.OrthographicCamera,
    domElement: HTMLElement,
    floorPlane: THREE.Plane
  ) {
    this.camera = camera;
    this.floorPlane = floorPlane;

    this._ray = new THREE.Ray();
    this._ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);

    this._oz = (camera.near + camera.far) / (camera.near - camera.far);

    this._calculateUnitVectors();
    window.addEventListener("resize", () => this._calculateUnitVectors());

    this._setupEvents(domElement);
  }

  _calculateUnitVectors() {
    const intersect0 = new THREE.Vector3();
    const intersectX = new THREE.Vector3();
    const intersectY = new THREE.Vector3();

    const setRayPos = (screenX: number, screenY: number) => {
      const ndcX = (2 * screenX) / window.innerWidth - 1;
      const ndcY = (2 * screenY) / window.innerHeight - 1;

      this._ray.origin.set(ndcX, ndcY, this._oz).unproject(this.camera);
    };

    setRayPos(0, 0);
    this._ray.intersectPlane(this.floorPlane, intersect0);

    setRayPos(1, 0);
    this._ray.intersectPlane(this.floorPlane, intersectX);

    setRayPos(0, 1);
    this._ray.intersectPlane(this.floorPlane, intersectY);

    this._dx.subVectors(intersectX, intersect0);
    this._dy.subVectors(intersectY, intersect0);
  }

  _dist<P extends { x: number; y: number }>(p: P, q: P): number {
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  _zoomScale(delta: number) {
    return Math.pow(0.95, this.zoomSpeed * Math.abs(delta * 0.1));
  }

  _wheel(ev: WheelEvent) {
    if (Math.abs(ev.deltaY) <= 0.001) {
      return;
    }

    const zoomScale = this._zoomScale(ev.deltaY / 10);

    if (ev.deltaY < 0) {
      this.camera.zoom *= zoomScale;
    } else if (ev.deltaY > 0) {
      this.camera.zoom /= zoomScale;
    }

    this.camera.zoom = THREE.MathUtils.clamp(
      this.camera.zoom,
      this.minZoom,
      this.maxZoom
    );

    this.camera.updateProjectionMatrix();
  }

  _pointerDown(ev: PointerEvent) {
    this._evCache.push(ev);
  }

  _pointerMove(ev: PointerEvent) {
    const index = this._evCache.findIndex(
      (cev) => cev.pointerId === ev.pointerId
    );

    switch (this._evCache.length) {
      case 1:
        const last = this._evCache[index];

        const dx = ev.x - last.x;
        const dy = ev.y - last.y;

        const moveX = this._dx.clone();
        moveX.multiplyScalar(dx);

        const moveY = this._dy.clone();
        moveY.multiplyScalar(dy);

        this.camera.position.sub(moveX);
        this.camera.position.add(moveY);

        this._evCache[index] = ev;
        break;

      case 2:
        this._evCache[index] = ev;

        const p0 = this._evCache[0];
        const p1 = this._evCache[1];

        const currDiff = this._dist(p0, p1);

        console.log(currDiff, this._pinchDiff);

        if (this._pinchDiff > 0) {
          const delta = currDiff - this._pinchDiff;
          const zoomScale = this._zoomScale(delta);

          if (delta < 0) {
            this.camera.zoom *= zoomScale;
          } else if (delta > 0) {
            this.camera.zoom /= zoomScale;
          }

          this.camera.zoom = THREE.MathUtils.clamp(
            this.camera.zoom,
            this.minZoom,
            this.maxZoom
          );

          this.camera.updateProjectionMatrix();
        }

        this._pinchDiff = currDiff;

        break;
    }
  }

  _pointerUp(ev: PointerEvent) {
    const index = this._evCache.findIndex(
      (cev) => cev.pointerId === ev.pointerId
    );
    this._evCache.splice(index, 1);

    if (this._evCache.length < 2) {
      this._pinchDiff = -1;
      this._calculateUnitVectors();
    }
  }

  _setupEvents(elem: HTMLElement) {
    elem.addEventListener("wheel", (ev) => this._wheel(ev));

    elem.addEventListener("pointerdown", (ev) => this._pointerDown(ev));
    elem.addEventListener("pointermove", (ev) => this._pointerMove(ev));

    elem.addEventListener("pointerup", (ev) => this._pointerUp(ev));
    elem.addEventListener("pointercancel", (ev) => this._pointerUp(ev));
    elem.addEventListener("pointerout", (ev) => this._pointerUp(ev));
    elem.addEventListener("pointerleave", (ev) => this._pointerUp(ev));
  }
}
