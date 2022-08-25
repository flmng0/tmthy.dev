<script lang="ts">
	import feather from 'feather-icons'

	export let key: string

	$: icon = feather.icons[key]
	$: svg = icon.toSvg({
		width: '1em',
		height: '1em',
		...$$restProps,
	})
</script>

{@html svg}
