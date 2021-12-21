<script lang="ts">
	import rawProjects from "$data/projects.json";

	import CardList from "$components/CardList.svelte";
	import DisplayCard from "$components/DisplayCard.svelte";
	import { siteName } from "$lib/consts";
	import Main from "$components/Main.svelte";

	type Project = {
		links: Record<string, string>;
		name: string;
		description: string;
	};

	const projects = rawProjects as Project[];
</script>

<svelte:head>
	<title>Project Index | {siteName}</title>
</svelte:head>

<Main>
	<CardList>
		{#each projects as project}
			<DisplayCard href={project.links["web"]} {...project} />
		{/each}
	</CardList>
</Main>
