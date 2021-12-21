<div class="container">
	<slot />
</div>

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(20em, 1fr));
		gap: 2em;
		// padding: 2em 1.5em;
	}
</style>
