import * as THREE from "three";
import { icons } from "./data";

// Eventually want to keep this in a separate file or done with astro:content
export type Link = { href: string; name: string; disableAnimation?: boolean };

type SocialLink = Link & { icon: string; color: number };
const socials: SocialLink[] = [
  {
    href: "https://github.com/flmng0",
    name: "GitHub",
    icon: icons.github,
    color: 0x24292e,
  },
  {
    href: "https://www.linkedin.com/in/timothy-davis-dev",
    name: "LinkedIn",
    icon: icons.linkedin,
    color: 0x0077b5,
  },
  {
    href: "mailto:tmthydvs@gmail.com",
    name: "Email to tmthydvs@gmail.com",
    icon: icons.email,
    color: 0xea7b12,
  },
];

const word = "tmthy.dev";
const letterPadding = 0.5;

const buttonHeight = 0.5;
const buttonIdleY = -(buttonHeight - 0.1);
const buttonHoverY = buttonIdleY + 0.2;

const globals = {
  canvas: undefined as unknown as HTMLCanvasElement,
  renderer: undefined as unknown as THREE.WebGLRenderer,
  camera: undefined as unknown as THREE.OrthographicCamera,
  scene: undefined as unknown as THREE.Scene,
  dirLight: undefined as unknown as THREE.DirectionalLight,

  floorPlane: undefined as unknown as THREE.Plane,
  floor: undefined as unknown as THREE.Mesh,

  buttonLayer: 1,
  zFightOff: 0.001,

  word,
  letterPadding,

  buttonHeight,
  buttonIdleY,
  buttonHoverY,
  buttonDelay: 100,

  socials,

  frustumSize: word.length / 2 + letterPadding,
};

export default globals;
