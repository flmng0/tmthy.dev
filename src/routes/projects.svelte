<script lang="ts" context="module">
	export async function load({ fetch }) {
		const request = await fetch('/api/projects.json')

		if (request.ok) {
			const data = await request.json()

			return {
				props: {
					...data,
				},
			}
		}

		return {
			status: request.status,
			error: new Error('Failed to load project index'),
		}
	}
</script>

<script lang="ts">
	import DisplayCard from '$components/DisplayCard.svelte'
	import Main from '$components/Main.svelte'
	import type { CardItem, Project } from '$lib/types'

	const cardItem = (project: Project): CardItem => ({
		name: project.name,
		description: project.brief,
		imagePath: null,
	})

	export let projects: Array<Project>
</script>

<svelte:head>
	<title>Project Directory | flmng0</title>
</svelte:head>

<Main>
	<nav>
		{#each projects as project}
			<a href={project.source}>
				<DisplayCard item={cardItem(project)} />
			</a>
		{/each}
	</nav>
</Main>

<style lang="scss">
	a {
		display: block;
		text-decoration: none;

		& + & {
			margin-top: 1em;
		}
	}
</style>
