<script lang="ts">
	import type { CardItem } from '$lib/types'

	export let item: CardItem
</script>

<div>
	{#if item.imagePath}
		<section class="image">
			<img src={item.imagePath} alt={`Screenshot of ${item.name}`} />
		</section>
	{/if}
	<section class="info">
		<h2>{item.name}</h2>
		<p>{item.description}</p>
	</section>
</div>

<style lang="scss">
	div {
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;

		padding: 1em 2em;

		background-color: var(--color-bg-secondary);
		box-shadow: 0 2px 8px 0 var(--color-shadow);

		transition: transform var(--transition);

		&:hover {
			transform: scale(1.01);

			.info > h2 {
				text-decoration: underline;
			}
		}
	}

	.image {
		margin: 0;
	}

	.info {
		text-decoration: none;
	}
</style>
