<script>
	import { T } from "@threlte/core";

	let { value, font, ...meshProps } = $props();

	const parameters = {
		font,
		size: 1,
		depth: 1,
		bevelEnabled: true,
		bevelOfset: 0,
		bevelSize: 0.05,
		bevelThickness: 0.05,
		bevelSegments: 1,
	};
</script>

<T.Mesh {...meshProps} rotation.x={Math.PI * -0.5}>
	<T.TextGeometry args={[value, parameters]} />
	<T.MeshPhongMaterial color={0xffffff} />
</T.Mesh>
