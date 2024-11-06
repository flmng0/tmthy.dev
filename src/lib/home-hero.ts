import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

import anime from "animejs";

import setupSections, { type SetupState } from "./setup.ts";
import globals, { type Link } from "./globals.ts";
import { IsoMapControls } from "./controls.ts";

type Setter<T> = (value: T) => void;

const cameraParams = (frustum?: number) => {
  frustum = frustum || globals.frustumSize;
  const aspect = globals.canvas.height / globals.canvas.width;

  const left = -frustum;
  const right = frustum;
  const top = frustum * aspect;
  const bottom = -frustum * aspect;
  const near = 1;
  const far = 1000;

  return [left, right, top, bottom, near, far];
};

export let goHome: () => void;

function openLink(location: string) {
  window.open(location)?.focus();
}

function enableControls(setLink: Setter<Link>, setFar: Setter<boolean>) {
  const controls = new IsoMapControls(
    globals.camera,
    globals.renderer.domElement,
    globals.floorPlane
  );

  const farDist = 10;
  const farDistSq = farDist * farDist;

  goHome = () => {
    const home = controls._camera0;
    anime({
      targets: globals.camera.position,
      x: home.x,
      z: home.z,
      duration: 750,
      easing: "easeOutCubic",
    });
  };

  const raycaster = new THREE.Raycaster();
  raycaster.layers.set(globals.buttonLayer);

  const pointer = new THREE.Vector2();

  let button: THREE.Object3D | null = null;
  let intersectionTime: number = 0;
  let now: number = 0;

  const setY = (p: THREE.Object3D, y: number) => {
    if (p.userData?.disableAnimation) {
      return;
    }

    // Cancel any prior animation
    anime.remove(p.position);
    // Animate to target position
    anime({
      targets: p.position,
      y,
      duration: 200,
    });
  };

  const setPointer = (e: MouseEvent) => {
    pointer.x = (2 * e.x) / window.innerWidth - 1;
    pointer.y = (-2 * e.y) / window.innerHeight + 1;
  };

  const elem = globals.renderer.domElement;

  elem.addEventListener("pointerup", setPointer);
  elem.addEventListener("pointermove", setPointer);

  elem.addEventListener("click", (e) => {
    if (!button) {
      return;
    }

    setPointer(e);

    raycaster.setFromCamera(pointer, globals.camera);
    const hits = raycaster.intersectObject(button, false);

    // If not clicking the button that was previously selected
    if (hits.length === 0 || hits[0].object !== button) {
      return;
    }

    if (now - intersectionTime < globals.buttonDelay) {
      return;
    }

    openLink(button.userData.href);
  });

  const handleIntersection = (hit: THREE.Object3D, t: number) => {
    if (hit === button) {
      return;
    }

    if (button) {
      setY(button, globals.buttonIdleY);
    }

    if (hit === globals.floor) {
      button = null;
      return;
    }

    intersectionTime = t;
    button = hit;
    setY(button, globals.buttonHoverY);
  };

  globals.renderer.setAnimationLoop((t: number) => {
    now = t;

    raycaster.setFromCamera(pointer, globals.camera);

    const hits = raycaster.intersectObjects(globals.scene.children);

    if (hits.length > 0) {
      const hit = hits[0].object;

      handleIntersection(hit, t);
    }

    setLink(button?.userData as Link);
    setFar(controls.getDistSquared() >= farDistSq);

    globals.renderer.render(globals.scene, globals.camera);
  });
}

async function setupScene(timeline: anime.AnimeTimelineInstance) {
  const scene = new THREE.Scene();
  globals.scene = scene;

  const state: SetupState = {
    textureLoader: new THREE.TextureLoader(),
    fontLoader: new FontLoader(),
    svgLoader: new SVGLoader(),
  };

  const sections = await Promise.all(
    setupSections.map((setup) => setup(state))
  );

  for (const section of sections) {
    scene.add(section.object);
    for (const { params, timelineOffset } of section.animations) {
      timeline.add(params, timelineOffset);
    }
  }

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  globals.dirLight = dirLight;

  dirLight.position.set(10, 15, -10);
  dirLight.lookAt(0, 0, 0);
  dirLight.castShadow = false;

  scene.add(ambientLight, dirLight);
}

export async function start(
  canvas: HTMLCanvasElement,
  setLink: Setter<Link>,
  setFar: Setter<boolean>
) {
  globals.canvas = canvas;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  globals.renderer = renderer;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const camera = new THREE.OrthographicCamera(...cameraParams());
  globals.camera = camera;

  const camStartPolar = {
    azimuth: Math.PI / 4,
    altitude: Math.PI / 2 - Math.atan(1 / Math.SQRT2),
  };
  const camDist = 100;

  const camStart = new THREE.Vector3();
  camStart.setFromSphericalCoords(
    camDist,
    camStartPolar.altitude,
    camStartPolar.azimuth
  );

  camera.position.set(camStart.x, camStart.y, camStart.z);
  camera.lookAt(0, 0, 0);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    const [left, right, top, bottom] = cameraParams();

    camera.left = left;
    camera.right = right;
    camera.top = top;
    camera.bottom = bottom;

    camera.updateProjectionMatrix();

    renderer.render(globals.scene, camera);
  });

  const timeline = anime.timeline({ autoplay: false });
  await setupScene(timeline);

  globals.renderer.render(globals.scene, globals.camera);

  const camDuration = 1500;

  timeline
    .add(
      {
        targets: camera,
        zoom: 0.75,
        easing: "easeInOutSine",
        duration: camDuration,
        update: function () {
          camera.updateProjectionMatrix();
        },
      },
      "-=" + camDuration
    )
    .add(
      {
        targets: camera.position,
        z: (pos: THREE.Vector3) => pos.z + 1.5,
        easing: "easeInOutSine",
        duration: camDuration,
      },
      "-=" + camDuration
    );

  function tick() {
    globals.renderer.render(globals.scene, globals.camera);

    if (!timeline.completed) {
      window.requestAnimationFrame(tick);
    } else {
      enableControls(setLink, setFar);
    }
  }

  timeline.play();
  window.requestAnimationFrame(tick);
}
