import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { easeOutElastic, easeInOutSine } from "./util";

let renderer: THREE.WebGLRenderer;
let camera: THREE.OrthographicCamera;
let scene: THREE.Scene;

const word = "tmthy.dev";

const letterSpacing = 1;
const letterOffset = 0.125;
const letterPadding = 0.5;
const FRUSTUM_SIZE = word.length / 2 + letterPadding;

export async function start(canvas: HTMLCanvasElement) {
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

  const cameraParams = () => {
    const aspect = canvas.clientHeight / canvas.clientWidth;

    const left = -FRUSTUM_SIZE;
    const right = FRUSTUM_SIZE;
    const top = FRUSTUM_SIZE * aspect;
    const bottom = -FRUSTUM_SIZE * aspect;
    const near = 1;
    const far = 100;

    return [left, right, top, bottom, near, far];
  };

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

  const camEnd = new THREE.Vector3(0, camDist, 0);

  camera.position.set(camStart.x, camStart.y, camStart.z);
  camera.lookAt(0, 0, 0);

  const camStartQuat = camera.quaternion.clone();
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
    textMesh.position.y = -0.5;
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

  const timeline: Array<(t: number) => boolean> = [
    (t) => {
      const n = textMeshes.length;
      const speed = 1;
      const separation = 0.1;

      for (let i = 0; i < n; i++) {
        const textMesh = textMeshes[i];

        const u = Math.min(speed * t - separation * i, 1);

        const y = easeOutElastic(u) * 1.0 - 2.3;
        textMesh.position.y = y;
      }

      // Reverse of the u assignment above
      return t >= 1 + (n - 2) * separation * (1 / speed);
    },
    (t) => {
      const total = 1.5;

      const u = easeInOutSine(t / total);

      camera.position.lerpVectors(camStart, camEnd, u);
      camera.quaternion.slerpQuaternions(camStartQuat, camEndQuat, u);

      return t >= total;
    },
  ];

  let start: number;
  let timelineIdx = 0;

  function animate(u: number) {
    if (start === undefined) {
      start = u;
    }
    const t = (u - start) * 0.001;

    const timelineFn = timeline[timelineIdx];

    if (timelineFn !== undefined) {
      const next = timelineFn(t);

      if (next) {
        timelineIdx += 1;
        start = u;
      }
    } else {
      renderer.setAnimationLoop(null);
    }
    console.count("Animating!");

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);
}
