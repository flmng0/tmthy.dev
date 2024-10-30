import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader, Font } from "three/addons/loaders/FontLoader.js";

import anime from "animejs";

import * as data from "./data";
import { shuffle } from "./util.ts";
import { IsoMapControls } from "./controls.ts";

type BooleanSetter = (value: boolean) => void;

// Eventually want to keep this in a separate file or done with astro:content
type Social = { href: string; name: string };

const socials: Social[] = [
  { href: "https://github.com/flmng0", name: "GitHub" },
  { href: "https://www.linkedin.com/in/timothy-davis-dev", name: "LinkedIn" },
];

const socialHandler = (social: Social) => {
  return () => {
    window.location.assign(social.href);
  };
};

let canvas: HTMLCanvasElement;
let renderer: THREE.WebGLRenderer;
let camera: THREE.OrthographicCamera;
let scene: THREE.Scene;

const clickHandlers: Record<string, () => void> = {};

const textGroup = new THREE.Group();
const allPedestals = new THREE.Group();
const socialPedestals = new THREE.Group();

allPedestals.add(socialPedestals);

let floorPlane: THREE.Plane;
let floor: THREE.Mesh;

const farDist = 10;
const farDistSq = farDist * farDist;

// Used for grouping / querying only the pedestals.
const pedestalLayer = 1;
const pedestalHeight = 0.5;
const pedestalIdleY = -(pedestalHeight - 0.1);
const pedestalHoverY = pedestalIdleY + 0.2;

const word = "tmthy.dev";

const letterSpacing = 1;
const letterOffset = 0.125;
const letterPadding = 0.5;

const FRUSTUM_START = word.length / 2 + letterPadding;
let frustumSize = FRUSTUM_START;

const cameraParams = (frustum?: number) => {
  frustum = frustum || frustumSize;
  const aspect = canvas.height / canvas.width;

  const left = -frustum;
  const right = frustum;
  const top = frustum * aspect;
  const bottom = -frustum * aspect;
  const near = 1;
  const far = 1000;

  return [left, right, top, bottom, near, far];
};

export let goHome: () => void;

function enableControls(setHover: BooleanSetter, setFar: BooleanSetter) {
  const controls = new IsoMapControls(camera, renderer.domElement, floorPlane);

  goHome = () => {
    const home = controls._camera0;
    anime({
      targets: camera.position,
      x: home.x,
      z: home.z,
      duration: 750,
      easing: "easeOutCubic",
    });
  };

  const raycaster = new THREE.Raycaster();
  raycaster.layers.set(pedestalLayer);

  const pointer = new THREE.Vector2();

  let pedestal: THREE.Object3D | null = null;

  const setY = (p: THREE.Object3D, y: number) => {
    // Cancel any prior animation
    anime.remove(p.position);
    // Animate to target position
    anime({
      targets: p.position,
      y,
      duration: 200,
    });
  };

  const setPointer = (e: PointerEvent) => {
    pointer.x = (2 * e.x) / window.innerWidth - 1;
    pointer.y = (-2 * e.y) / window.innerHeight + 1;
  };

  const elem = renderer.domElement;
  elem.addEventListener("pointerdown", setPointer);
  elem.addEventListener("pointermove", setPointer);

  const handleClick = () => {
    if (pedestal === null) {
      return;
    }

    const id = pedestal.userData.clickHandlerId;
    const clickHandler = clickHandlers[id];
    clickHandler();
  };

  elem.addEventListener("click", handleClick);

  const handleIntersection = (hit: THREE.Object3D) => {
    if (hit === pedestal) {
      return;
    }

    if (pedestal) {
      setY(pedestal, pedestalIdleY);
    }

    if (hit === floor) {
      pedestal = null;
      return;
    }

    pedestal = hit;
    setY(pedestal, pedestalHoverY);
  };

  renderer.setAnimationLoop(() => {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects([allPedestals, floor]);

    if (hits.length > 0) {
      const hit = hits[0].object;

      handleIntersection(hit);
    }

    setHover(pedestal !== null);
    setFar(controls.getDistSquared() >= farDistSq);

    renderer.render(scene, camera);
  });
}

function setupScene(floorTileTexture: THREE.Texture, font: Font) {
  scene = new THREE.Scene();

  const floorSize = 256;

  floorTileTexture.wrapS = THREE.RepeatWrapping;
  floorTileTexture.wrapT = THREE.RepeatWrapping;
  floorTileTexture.repeat.set(floorSize, floorSize);

  // So that unit coordinates are in the middle of squares
  floorTileTexture.offset.set(-0.5, -0.5);

  const xOff = 0;
  const zOff = 0.375;

  const floorGeom = new THREE.PlaneGeometry(floorSize, floorSize);
  const floorMat = new THREE.MeshPhongMaterial({ map: floorTileTexture });

  floor = new THREE.Mesh(floorGeom, floorMat);
  floor.layers.enable(pedestalLayer);

  floor.rotation.x = Math.PI * -0.5;
  floor.position.y = -0.5;
  floor.receiveShadow = true;
  scene.add(floor);

  floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), floor.position.y);

  const textParams = {
    font,
    size: 1,
    depth: 1,
    bevelEnabled: true,
    bevelOffset: 0,
    bevelSize: 0.05,
    bevelThickness: 0.05,
    bevelSegments: 1,
  };

  const textGeom: Record<string, TextGeometry> = {};
  const textMat = new THREE.MeshPhongMaterial({ color: 0xffffff });

  let i = letterOffset + -word.length / 2;
  for (const char of word) {
    let geom = textGeom[char];
    if (geom === undefined) {
      geom = new TextGeometry(char, textParams);
      textGeom[char] = geom;
    }

    const textMesh = new THREE.Mesh(geom, textMat);
    textMesh.castShadow = true;
    textMesh.position.x = i * letterSpacing;
    textMesh.rotation.x = Math.PI * -0.5;
    textGroup.add(textMesh);

    i += 1;
  }

  textGroup.position.set(xOff, -2.3, zOff);
  scene.add(textGroup);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(10, 15, -10);
  dirLight.lookAt(0, 0, 0);
  dirLight.castShadow = true;

  scene.add(ambientLight, dirLight);

  allPedestals.position.y = -pedestalHeight * 0.5;
  allPedestals.position.z = 3;

  const pedestalGeom = new THREE.BoxGeometry(1, pedestalHeight, 1);
  const pedestalMat = textMat.clone();

  const gap = 1;
  i = 0;
  for (const social of socials) {
    const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
    pedestal.layers.enable(pedestalLayer);

    pedestal.position.x = i++ * (gap + 1);

    const cbId = "social-" + social.name;
    clickHandlers[cbId] = socialHandler(social);
    pedestal.userData.clickHandlerId = cbId;

    socialPedestals.add(pedestal);
  }

  // For the intro animation, shuffle everything
  shuffle(socialPedestals.children);
  socialPedestals.position.x =
    -Math.floor(socialPedestals.children.length / 2) - 2;

  scene.add(allPedestals);
}

export async function start(
  cvs: HTMLCanvasElement,
  setHover: BooleanSetter,
  setFar: BooleanSetter
) {
  canvas = cvs;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera = new THREE.OrthographicCamera(...cameraParams());

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

  const textureLoader = new THREE.TextureLoader();
  const fontLoader = new FontLoader();

  const floorTilePromise = textureLoader.loadAsync(data.floorTileTextureData);
  const fontPromise = fontLoader.loadAsync(data.fontJsonData);

  const [floorTileTexture, font] = await Promise.all([
    floorTilePromise,
    fontPromise,
  ]);

  setupScene(floorTileTexture, font);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    const [left, right, top, bottom] = cameraParams();

    camera.left = left;
    camera.right = right;
    camera.top = top;
    camera.bottom = bottom;

    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
  });

  renderer.render(scene, camera);

  const timeline = anime.timeline({
    autoplay: false,
    complete: () => {
      enableControls(setHover, setFar);
    },
  });

  const camDuration = 1500;

  timeline
    .add({
      targets: textGroup.children.map((o) => o.position),
      y: 1.0,
      duration: 700,
      delay: anime.stagger(90, { start: 700 }),
      easing: "easeOutElastic",
    })
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
      "-=" + (90 * word.length - 200)
    )
    .add(
      {
        targets: camera.position,
        z: (pos: THREE.Vector3) => pos.z + 1.5,
        easing: "easeInOutSine",
        duration: camDuration,
      },
      "-=" + camDuration
    )
    .add(
      {
        targets: socialPedestals.children.map((o) => o.position),
        y: [-pedestalHeight - 0.05, pedestalIdleY],
        duration: 800,
        delay: anime.stagger(100),
      },
      "-=700"
    );

  function tick(t: number) {
    timeline.tick(t);
    renderer.render(scene, camera);

    if (!timeline.completed) {
      window.requestAnimationFrame(tick);
    }
  }

  window.requestAnimationFrame(tick);
}
