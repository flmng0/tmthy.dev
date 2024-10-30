import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader, Font } from "three/addons/loaders/FontLoader.js";
import { IsoMapControls } from "./controls.ts";

import anime from "animejs";

import * as data from "./data";

let canvas: HTMLCanvasElement;
let renderer: THREE.WebGLRenderer;
let camera: THREE.OrthographicCamera;
let scene: THREE.Scene;
let textObjects: THREE.Mesh[];

let floorPlane: THREE.Plane;

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

function enableControls() {
  new IsoMapControls(camera, renderer.domElement, floorPlane);

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

function setupScene(floorTileTexture: THREE.Texture, font: Font) {
  scene = new THREE.Scene();

  const floorSize = 256;

  floorTileTexture.wrapS = THREE.RepeatWrapping;
  floorTileTexture.wrapT = THREE.RepeatWrapping;
  floorTileTexture.repeat.set(floorSize, floorSize);
  floorTileTexture.offset.set(-0.5, 0.125);

  const floorGeom = new THREE.PlaneGeometry(floorSize, floorSize);
  const floorMat = new THREE.MeshPhongMaterial({ map: floorTileTexture });

  const floor = new THREE.Mesh(floorGeom, floorMat);

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

  textObjects = [];
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
    textMesh.position.y = -2.3;
    textMesh.rotation.x = Math.PI * -0.5;
    textObjects.push(textMesh);

    i += 1;
  }

  scene.add(...textObjects);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(10, 15, -10);
  dirLight.lookAt(0, 0, 0);
  dirLight.castShadow = true;

  scene.add(ambientLight, dirLight);
}

export async function start(cvs: HTMLCanvasElement) {
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

  const camZ = camera.position.z + 1.5;

  const timeline = anime.timeline({
    autoplay: false,
    complete: enableControls,
  });

  timeline
    .add({
      targets: textObjects.map((o) => o.position),
      y: -1.3,
      duration: 950,
      delay: anime.stagger(90, { start: 700 }),
      easing: "easeOutElastic",
    })
    .add({
      targets: camera,
      zoom: 0.75,
      easing: "easeInOutSine",
      duration: 1000,
      update: function () {
        camera.updateProjectionMatrix();
      },
    })
    .add(
      {
        targets: camera.position,
        z: camZ,
        duration: 1000,
        easing: "easeInSine",
      },
      "-=1000"
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
