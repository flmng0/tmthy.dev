<script lang="ts">
	import rawProjects from '$data/projects.json'

	import CardList from '$components/CardList.svelte'
	import DisplayCard from '$components/DisplayCard.svelte'

	type Project = {
		links: Record<string, string>
		name: string
		description: string
	}

	const projects = rawProjects as Project[]
</script>

<main>
	<CardList>
		{#each projects as project}
			<DisplayCard href={project.links['web']} {...project} />
		{/each}
	</CardList>
</main>

<style lang="scss">
	main {
		width: min(100%, 60rem);
		margin: 1em auto;
	}
</style>
