import * as THREE from "three";
//import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

let renderer: THREE.WebGLRenderer;
let camera: THREE.OrthographicCamera;
let scene: THREE.Scene;

export async function start(canvas: HTMLCanvasElement) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog("lightgray", 1, 100);

  const aspect = canvas.clientWidth / canvas.clientHeight;
  const d = 5;
  const left = -d * aspect;
  const right = d * aspect;
  const top = d;
  const bottom = -d;
  const near = 1;
  const far = 1000;
  camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);

  const camDist = 20;
  const camStart = new THREE.Vector3(camDist, camDist, camDist);
  const camEnd = new THREE.Vector3(0, camDist, 0);
  camera.position.set(camStart.x, camStart.y, camStart.z);
  camera.lookAt(scene.position);

  const camUpStart = camera.up.clone();
  const camUpEnd = new THREE.Vector3(0, 0, -1);

  const textureLoader = new THREE.TextureLoader();

  const floorSize = 256;
  const floorTileTextureData = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAAXNSR0IArs4c6QAAAv5JREFUeJzt1bFtAzEQRUHauFZ8gIMr4PovgYEAqhkHElyCGLyZaMOfPOzXfd8Dqo4xxnVdu2fABnPO43Wd57l7DHzUWuv9AV5+zt+te+BznuvxOr53L4GdBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSjv/ruR5bl8AG7wDWWruXwAbHGGPOuXsG7PEHVpkTSgWHbCwAAAAASUVORK5CYII=`;
  const floorTileTexture = await textureLoader.loadAsync(floorTileTextureData);

  floorTileTexture.wrapS = THREE.RepeatWrapping;
  floorTileTexture.wrapT = THREE.RepeatWrapping;
  floorTileTexture.repeat.set(floorSize, floorSize);
  floorTileTexture.offset.set(-0.5, -0.5);

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

  const word = "tmthy.dev";

  const letterSpacing = 0.75;
  const letterOffset = 0.25;

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

  //scene.add(new THREE.AxesHelper(20));

  scene.add(ambientLight, dirLight);

  renderer.render(scene, camera);

  const timeline: Array<(t: number) => boolean> = [
    (t) => {
      const n = textMeshes.length;

      for (let i = 0; i < n; i++) {
        const textMesh = textMeshes[i];

        const u = t * 3 - i * 0.5;
        const j = Math.sin(Math.min(Math.PI, u));

        textMesh.position.y = -1.3 + 0.1 * j * j;
      }

      // Reverse of the u assignment above, stopping at Math.PI
      return t >= (Math.PI + 0.5 * n) / 3;
    },
    (t) => {
      const alpha = t / 2;

      camera.position.lerpVectors(camStart, camEnd, alpha);
      camera.up.lerpVectors(camUpStart, camUpEnd, alpha);
      camera.lookAt(scene.position);

      return t >= 2;
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
    }

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);
}
