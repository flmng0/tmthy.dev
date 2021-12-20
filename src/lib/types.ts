import type { SvelteComponent } from "svelte";

export interface Point {
	x: number;
	y: number;
}
export type Triangle = [Point, Point, Point];
