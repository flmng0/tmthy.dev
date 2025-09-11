/**
 * @typedef {object} ScrollTrigger
 * @property {string} key
 * @property {import("three").Vector3Like} target
 * @property {HTMLElement | string} trigger
 * @property {(active: boolean) => void} [ontoggle]
 */

import { SvelteMap } from 'svelte/reactivity'

const appState = $state({
  title: '',
  ready: false,

  /** @type {SvelteMap<string, import('svelte').Snippet>} */
  objects: new SvelteMap(),

  /** @type {ScrollTrigger[]} */
  scrollTriggers: [],
})

export default appState
