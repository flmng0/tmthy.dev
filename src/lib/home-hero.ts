import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

import anime from "animejs";

let renderer: THREE.WebGLRenderer;
let camera: THREE.OrthographicCamera;
let scene: THREE.Scene;
let canvas: HTMLCanvasElement;

const word = "tmthy.dev";

const letterSpacing = 1;
const letterOffset = 0.125;
const letterPadding = 0.5;
const FRUSTUM_SIZE = word.length / 2 + letterPadding;

const cameraParams = (frustum?: number) => {
  frustum = frustum || FRUSTUM_SIZE;

  const aspect = canvas.clientHeight / canvas.clientWidth;

  const left = -frustum;
  const right = frustum;
  const top = frustum * aspect;
  const bottom = -frustum * aspect;
  const near = 1;
  const far = 100;

  return [left, right, top, bottom, near, far];
};

export async function start(cvs: HTMLCanvasElement, complete: () => void) {
  canvas = cvs;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog("lightgray", 1, 100);

  camera = new THREE.OrthographicCamera(...cameraParams());

  window.addEventListener("resize", () => {
    const [left, right, top, bottom] = cameraParams();

    camera.left = left;
    camera.right = right;
    camera.top = top;
    camera.bottom = bottom;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  });

  const camStartPolar = {
    azimuth: Math.PI / 4,
    altitude: Math.PI / 2 - Math.atan(1 / Math.SQRT2),
  };
  const camDist = 20;

  const camStart = new THREE.Vector3();
  camStart.setFromSphericalCoords(
    camDist,
    camStartPolar.altitude,
    camStartPolar.azimuth
  );

  camera.position.set(camStart.x, camStart.y, camStart.z);
  camera.lookAt(0, 0, 0);

  const camEndQuat = new THREE.Quaternion();
  camEndQuat.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI / 2);

  const textureLoader = new THREE.TextureLoader();

  const floorSize = 256;
  const floorTileTextureData = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAAXNSR0IArs4c6QAAAv5JREFUeJzt1bFtAzEQRUHauFZ8gIMr4PovgYEAqhkHElyCGLyZaMOfPOzXfd8Dqo4xxnVdu2fABnPO43Wd57l7DHzUWuv9AV5+zt+te+BznuvxOr53L4GdBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSjv/ruR5bl8AG7wDWWruXwAbHGGPOuXsG7PEHVpkTSgWHbCwAAAAASUVORK5CYII=`;
  const floorTileTexture = await textureLoader.loadAsync(floorTileTextureData);

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

  const fontLoader = new FontLoader();
  const font = await fontLoader.loadAsync("/JetBrainsMono NF_Regular.json");
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

  const textMeshes: Array<THREE.Mesh> = [];
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
    textMeshes.push(textMesh);

    i += 1;
  }

  scene.add(...textMeshes);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(10, 15, -10);
  dirLight.lookAt(0, 0, 0);
  dirLight.castShadow = true;

  scene.add(ambientLight, dirLight);

  renderer.render(scene, camera);

  const targetFrustum = FRUSTUM_SIZE * 2;
  const frustumDelta = targetFrustum - FRUSTUM_SIZE;

  const [left, right, top, bottom] = cameraParams(FRUSTUM_SIZE + frustumDelta);

  const timeline = anime.timeline();

  timeline
    .add({
      targets: textMeshes.map((m) => m.position),
      y: -1.3,
      duration: 950,
      delay: anime.stagger(90, { start: 700 }),
      easing: "easeOutElastic",
      update: function () {
        renderer.render(scene, camera);
      },
      complete,
    })
    .add({
      targets: camera,
      left,
      right,
      top,
      bottom,
      easing: "easeInOutSine",
      duration: 1000,
      update: function () {
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      },
    });

  timeline.play();
}
