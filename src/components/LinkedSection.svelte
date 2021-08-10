<script lang="ts">
	export let id: string
</script>

<section {id}>
	<a href={`#${id}`}><slot name="header" /></a>

	<slot />
</section>

<style lang="scss">
	a {
		text-decoration: none;
		position: relative;
		display: block;

		&:hover {
			&::before {
				content: '§';

				position: absolute;

				right: 100%;
				top: 50%;

				transform: translateY(-50%);

				padding-right: 1rem;
			}
		}
	}
</style>
