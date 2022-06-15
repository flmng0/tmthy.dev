<script lang="ts">
	import { onMount, tick } from 'svelte'
	import FeatherIcon from './FeatherIcon.svelte'

	let visible: boolean = false

	export const open = () => {
		visible = true
	}

	const close = () => {
		visible = false
	}
</script>

<div class="modal" on:click={close} class:open={visible}>
	<main class="inner" on:click|stopPropagation>
		<button on:click={close}>
			<FeatherIcon key="x" />
		</button>
		<slot />
	</main>
</div>

<style lang="scss">
	.modal {
		position: fixed;
		inset: 0;
		z-index: 9999;

		background: rgba(0, 0, 0, 40%);

		display: none;

		place-items: center;
		padding: 1em;

		&.open {
			display: grid;
		}
	}

	.inner {
		width: min(100%, 100ch);
		height: 100%;

		overflow: auto;

		display: grid;
		position: relative;

		button {
			all: unset;
			font-size: 2rem;
			position: absolute;
			top: 0;
			right: 0;
			margin: 0.5em;
			width: 1em;
			height: 1em;
			cursor: pointer;

			opacity: 0.9;

			&:hover {
				opacity: 0.6;
			}
		}
	}
</style>
