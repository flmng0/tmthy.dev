import { Point, Triangle } from './types'
import { SvelteComponent } from 'svelte'

import { MoonIcon, SunIcon } from 'svelte-feather-icons'

export const siteName: string = 'tmthydvs'

interface ThemeButton {
	name: string
	icon: typeof SvelteComponent
}

export const themes: Array<ThemeButton> = [
	{ name: 'dark', icon: MoonIcon },
	{ name: 'light', icon: SunIcon },
]

export const featherIconSize: string = '1.5x'

export const avatar: {
	points: Array<Point>
	lines: Array<[number, number]>
	triangles: Array<Triangle>
	colors: Array<string>
	colorMap: Array<number>
} = {
	points: [
		{
			x: 0.29236745,
			y: 0.70113523,
		},
		{
			x: 0.20191963999999998,
			y: 0.6349207299999999,
		},
		{
			x: 0.23670725,
			y: 0.5610660399999999,
		},
		{
			x: 0.16307594000000003,
			y: 0.42589984000000003,
		},
		{
			x: 0.29480359,
			y: 0.5233118999999999,
		},
		{
			x: 0.29369662,
			y: 0.42257914,
		},
		{
			x: 0.33244004,
			y: 0.33180869,
		},
		{
			x: 0.47413025,
			y: 0.422579,
		},
		{
			x: 0.33542388,
			y: 0.27415159,
		},
		{
			x: 0.54832787,
			y: 0.26632422,
		},
		{
			x: 0.6078158,
			y: 0.11290810000000001,
		},
		{
			x: 0.62973238,
			y: 0.26006235,
		},
		{
			x: 0.6524317000000001,
			y: 0.42287131,
		},
		{
			x: 0.79019317,
			y: 0.25066953000000003,
		},
		{
			x: 0.70957138,
			y: 0.57628743,
		},
		{
			x: 0.63755973,
			y: 0.84554837,
		},
		{
			x: 0.7894103800000001,
			y: 0.7985842599999999,
		},
	],
	lines: [
		[0, 1],
		[0, 2],
		[0, 4],
		[1, 2],
		[1, 3],
		[2, 4],
		[2, 3],
		[2, 5],
		[3, 5],
		[3, 6],
		[4, 5],
		[4, 7],
		[5, 6],
		[5, 7],
		[6, 7],
		[6, 8],
		[7, 8],
		[7, 9],
		[7, 12],
		[8, 9],
		[8, 10],
		[9, 10],
		[9, 11],
		[9, 12],
		[10, 11],
		[10, 13],
		[11, 12],
		[11, 13],
		[12, 13],
		[12, 14],
		[12, 15],
		[13, 14],
		[13, 16],
		[14, 15],
		[14, 16],
	],
	triangles: [
		[
			{ x: 29.236745, y: 70.113523 },
			{ x: 20.191964, y: 63.492073 },
			{ x: 23.670725, y: 56.106604 },
		],
		[
			{ x: 23.670726, y: 56.106604 },
			{ x: 16.307594, y: 42.589984 },
			{ x: 20.191964, y: 63.492073 },
		],
		[
			{ x: 29.236744, y: 70.11352 },
			{ x: 29.480359, y: 52.33119 },
			{ x: 23.670726, y: 56.106604 },
		],
		[
			{ x: 16.307594, y: 42.589984 },
			{ x: 29.369662, y: 42.257914 },
			{ x: 23.670726, y: 56.106619 },
		],
		[
			{ x: 29.480359, y: 52.33119 },
			{ x: 29.369662, y: 42.2579 },
			{ x: 23.670726, y: 56.106604 },
		],
		[
			{ x: 16.307594, y: 42.589984 },
			{ x: 33.244004, y: 33.180869 },
			{ x: 29.369662, y: 42.2579 },
		],
		[
			{ x: 29.480359, y: 52.33119 },
			{ x: 47.413025, y: 42.2579 },
			{ x: 29.369662, y: 42.2579 },
		],
		[
			{ x: 33.244004, y: 33.180869 },
			{ x: 47.413025, y: 42.2579 },
			{ x: 29.369662, y: 42.2579 },
		],
		[
			{ x: 33.244004, y: 33.180869 },
			{ x: 33.542388, y: 27.415159 },
			{ x: 47.413025, y: 42.2579 },
		],
		[
			{ x: 33.542388, y: 27.415159 },
			{ x: 54.832787, y: 26.632422 },
			{ x: 47.413025, y: 42.2579 },
		],
		[
			{ x: 33.542388, y: 27.415159 },
			{ x: 60.78158, y: 11.29081 },
			{ x: 54.832787, y: 26.632422 },
		],
		[
			{ x: 60.781575, y: 11.29081 },
			{ x: 62.973238, y: 26.006235 },
			{ x: 54.832787, y: 26.632422 },
		],
		[
			{ x: 54.832787, y: 26.632422 },
			{ x: 65.24317, y: 42.287131 },
			{ x: 47.413025, y: 42.25791 },
		],
		[
			{ x: 62.973238, y: 26.006235 },
			{ x: 65.24317, y: 42.287131 },
			{ x: 54.832787, y: 26.632422 },
		],
		[
			{ x: 60.781575, y: 11.29081 },
			{ x: 79.019317, y: 25.066953 },
			{ x: 62.973238, y: 26.006235 },
		],
		[
			{ x: 79.019317, y: 25.066953 },
			{ x: 65.24317, y: 42.287131 },
			{ x: 62.973238, y: 26.006235 },
		],
		[
			{ x: 65.24317, y: 42.287131 },
			{ x: 70.957138, y: 57.628743 },
			{ x: 79.019317, y: 25.066953 },
		],
		[
			{ x: 65.24317, y: 42.287131 },
			{ x: 63.755973, y: 84.554837 },
			{ x: 70.957138, y: 57.628743 },
		],
		[
			{ x: 70.957138, y: 57.628743 },
			{ x: 78.941038, y: 79.858426 },
			{ x: 79.01932, y: 25.066951 },
		],
	],
	colors: [
		'#282a36', // beak
		'#f65a93', // head
	],
	colorMap: [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
}
