<script>
	import { extend, T, useLoader } from "@threlte/core";

	import { FontLoader } from "three/addons/loaders/FontLoader.js";
	import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

	import fontData from "$lib/data/font.typeface.json?url";

	import Character from "./Character.svelte";
	import Floor from "./Floor.svelte";

	const loader = useLoader(FontLoader);
	const font = loader.load(fontData);

	extend({ TextGeometry });

	/** @type {{ title: string }} */
	let { title } = $props();

	const distance = 10;

	const popup = createTransition((ref) => {});
	///**
	// * @param obj {import("three").Object3D}
	// * @param delay {number}
	// */
	//const popup = (obj) => {
	//	return {
	//		/** @param t {number} */
	//		tick: (t) => {
	//			obj.position.y = -2.3 + t;
	//		},
	//	};
	//};
</script>

<T.OrthographicCamera
	zoom={80}
	makeDefault
	position={distance}
	oncreate={(ref) => {
		ref.lookAt(0, 0, 0);
	}}
/>

<T.AmbientLight intensity={0.8} />
<T.DirectionalLight
	intensity={1.5}
	position={[10, 15, -10]}
	oncreate={(ref) => ref.lookAt(0, 0, 0)}
/>

<Floor />

{#await font then font}
	{#key title}
		{#each title as char, i}
			{@const x = i + Math.round(-title.length / 2)}

			<Character value={char} {font} position={[x + 0.6, -1.3, 1.375]} />
		{/each}
	{/key}
{/await}
