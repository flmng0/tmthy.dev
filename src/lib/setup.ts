import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

import anime from "animejs";

import globals from "./globals.ts";
import * as data from "./data.ts";
import { shuffle } from "./util.ts";

const iconSize = 0.75;

const letterSpacing = 1;
const letterOffset = 0.125;

export type SetupState = {
  textureLoader: THREE.TextureLoader;
  svgLoader: SVGLoader;
  fontLoader: FontLoader;
};

type SetupAnimation = {
  params: anime.AnimeAnimParams;
  timelineOffset?: string;
};

type SetupResult = {
  object: THREE.Object3D;
  animations: SetupAnimation[];
};
type SectionSetupCallback = (state: SetupState) => Promise<SetupResult>;

const makeFloor: SectionSetupCallback = async (state: SetupState) => {
  const floorTileTexture = await state.textureLoader.loadAsync(
    data.floorTileTextureData
  );

  const floorSize = 256;

  floorTileTexture.wrapS = THREE.RepeatWrapping;
  floorTileTexture.wrapT = THREE.RepeatWrapping;
  floorTileTexture.repeat.set(floorSize, floorSize);

  // So that unit coordinates are in the middle of squares
  floorTileTexture.offset.set(-0.5, -0.5);

  const floorGeom = new THREE.PlaneGeometry(floorSize, floorSize);
  const floorMat = new THREE.MeshPhongMaterial({ map: floorTileTexture });

  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.layers.enable(globals.buttonLayer);

  floor.rotation.x = Math.PI * -0.5;
  floor.position.y = -0.5;
  floor.receiveShadow = true;

  const floorPlane = new THREE.Plane(
    new THREE.Vector3(0, 1, 0),
    floor.position.y
  );

  globals.floor = floor;
  globals.floorPlane = floorPlane;

  return { object: floor, animations: [] };
};

const makeTitle: SectionSetupCallback = async (state) => {
  const font = await state.fontLoader.loadAsync(data.fontJsonData);

  const xOff = 0;
  const zOff = 0.375;

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
  const textMat = new THREE.MeshPhongMaterial();
  const textGroup = new THREE.Group();

  let i = letterOffset + -globals.word.length / 2;
  for (const char of globals.word) {
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

  return {
    object: textGroup,
    animations: [
      {
        params: {
          targets: textGroup.children.map((o) => o.position),
          y: 1.0,
          duration: 700,
          delay: anime.stagger(90, { start: 700 }),
          easing: "easeOutElastic",
        },
      },
    ],
  };
};

const makeButtons: SectionSetupCallback = async (state) => {
  const buttonGeom = new THREE.BoxGeometry(1, globals.buttonHeight, 1);

  const buttons = await Promise.all([
    makeSocials(state.svgLoader, buttonGeom),
    // keep
  ]);
  const [socials] = buttons;
  const buttonGroup = new THREE.Group();

  buttonGroup.position.y = -globals.buttonHeight * 0.5;
  buttonGroup.position.z = 3;

  buttonGroup.add(...buttons);

  return {
    object: buttonGroup,
    animations: [
      {
        params: {
          targets: socials.children.map((o) => o.position),
          y: [
            -globals.buttonHeight - 2 * globals.zFightOff,
            globals.buttonIdleY,
          ],
          duration: 800,
          delay: anime.stagger(100),
        },
      },
    ],
  };
};

const makeVolleyballCourt: SectionSetupCallback = async (state: SetupState) => {
  const courtHalfTexture = await state.textureLoader.loadAsync(
    data.courtHalfData
  );

  courtHalfTexture.colorSpace = THREE.SRGBColorSpace;
  courtHalfTexture.magFilter = THREE.NearestFilter;

  const court = new THREE.Group();

  const courtScale = 1 / 3;
  court.scale.setScalar(courtScale);

  court.position.x = Math.floor(-globals.word.length / 2) - 2;
  court.position.z = 1.5;
  court.position.y = globals.floor.position.y + globals.zFightOff;

  const poleHeight = 2.43;
  const halfSize = 9;
  const poleSize = 0.1;

  const halfGeom = new THREE.PlaneGeometry(halfSize, halfSize);
  const halfMat = new THREE.MeshPhongMaterial({
    map: courtHalfTexture,
  });

  const halfA = new THREE.Mesh(halfGeom, halfMat);
  halfA.rotation.x = Math.PI * -0.5;
  halfA.position.z = halfSize / 2;

  const halfB = halfA.clone();
  halfB.position.z = -halfSize / 2;
  halfB.rotation.z = Math.PI;

  court.add(halfA, halfB);

  const poleGeom = new THREE.BoxGeometry(poleSize, poleHeight, poleSize);
  const poleMat = new THREE.MeshPhongMaterial({
    color: 0xc0c0c0,
  });

  const poleA = new THREE.Mesh(poleGeom, poleMat);
  poleA.position.x = -halfSize / 2 - 0.1;
  poleA.position.y = poleHeight / 2;

  const poleB = poleA.clone();
  poleB.position.x = halfSize / 2 + 0.1;

  court.add(poleA, poleB);

  return {
    object: court,
    animations: [
      {
        params: {
          targets: court.position,
          y: [20, court.position.y],
          duration: 500,
          easing: "easeOutCubic",
        },
      },
    ],
  };
};

const sections: SectionSetupCallback[] = [
  makeFloor,
  makeTitle,
  makeButtons,
  makeVolleyballCourt,
];

export default sections;

// Functions used within above setup functions.
//
// Placed down here to keep the above obvious.

async function makeSocials(loader: SVGLoader, geometry: THREE.BufferGeometry) {
  const iconMat = new THREE.MeshPhongMaterial();

  const iconExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    bevelEnabled: false,
    steps: 2,
    depth: 10,
  };

  const gap = 1;
  const socialPromises = globals.socials.map(async (social, i) => {
    const { paths } = await loader.loadAsync(social.icon);

    const iconMeshes = paths.map((path) => {
      const shapes = SVGLoader.createShapes(path);

      const iconGeom = new THREE.ExtrudeGeometry(shapes, iconExtrudeSettings);

      return new THREE.Mesh(iconGeom, iconMat);
    });
    const iconGroup = new THREE.Group();
    const y = globals.buttonHeight / 2 + globals.zFightOff;

    iconGroup.scale.setScalar(iconSize / data.iconViewBoxSize);
    iconGroup.rotation.x = Math.PI / 2;
    iconGroup.position.set(-iconSize / 2, y, -iconSize / 2);

    iconGroup.add(...iconMeshes);

    const buttonMat = new THREE.MeshPhongMaterial({ color: social.color });
    const button = new THREE.Mesh(geometry, buttonMat);
    button.add(iconGroup);

    button.layers.enable(globals.buttonLayer);
    button.position.x = i++ * (gap + 1);
    button.castShadow = true;
    button.userData = social;

    return button;
  });

  const results = await Promise.all(socialPromises);

  // For the intro animation, shuffle everything
  shuffle(results);

  const buttons = new THREE.Group();

  buttons.add(...results);
  buttons.position.x = -Math.floor(buttons.children.length / 2) - 1;

  return buttons;
}
