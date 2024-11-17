<script>
	import { Canvas } from "@threlte/core";
	import Scene from "./Scene.svelte";
	import { NeutralToneMapping } from "three";

	/** @type {{ title: string }} */
	let { title } = $props();
</script>

<Canvas toneMapping={NeutralToneMapping}>
	<Scene {title} />
</Canvas>
