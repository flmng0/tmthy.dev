import type { SvelteComponent } from 'svelte'

export interface Point {
	x: number
	y: number
}
export type Triangle = [Point, Point, Point]

export interface Sketch {
	id: string
	name: string
	brief?: string
}

export interface CardItem {
	name: string
	description?: string
	imagePath?: string
}
