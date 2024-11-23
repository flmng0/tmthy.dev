<script>
    import appState from '$lib/appState.svelte'

    import VolleyballCourt from '$lib/models/VolleyballCourt.svelte'
    import ProjectCard from './ProjectCard.svelte'
    import ContentWrapper from '$lib/ContentWrapper.svelte'

    appState.title = 'Projects'
</script>

<svelte:head>
    <title>View Projects | tmthy.dev</title>
    <meta
        name="description"
        content="Medium-large scale projects developed by Tim Davis."
    />
</svelte:head>

<ContentWrapper>
    <main id="scroller">
        <ProjectCard key="projects-header" position={{ x: 0, z: 0 }}>
            {#snippet title()}
                Projects
            {/snippet}

            <p>Porfolio of larger, public, projects that I've made.</p>
        </ProjectCard>

        <ProjectCard key="volley-kit" position={{ x: -6.5, z: 1 }}>
            {#snippet object()}
                <VolleyballCourt position.x={-6.5} position.z={1} />
            {/snippet}
            {#snippet title()}
                Volley Kit
            {/snippet}

            <p>
                Real-time synchronized scoring app, mainly for volleyball. This
                was developed using Phoenix and Elixir.
            </p>

            {#snippet actions()}
                <a class="button" href="https://github.com/flmng0/volley_kit">
                    View Source
                </a>
                <a class="button" href="https://volley-kit.tmthy.dev">Visit</a>
            {/snippet}
        </ProjectCard>
    </main>
</ContentWrapper>

<style>
    main {
        width: 100%;
        height: 100%;

        overflow-x: auto;
        scrollbar-width: none;

        display: flex;

        --peek: 1em;
        --gap: 0.5em;
        gap: var(--gap);

        --card-width: 100%;

        padding-inline: calc(var(--peek) + var(--gap));

        align-items: end;
        scroll-snap-type: x mandatory;

        position: relative;
    }

    main > :global(*) {
        scroll-snap-align: center;
        flex: 0 0 var(--card-width);
    }

    @media screen and (min-width: 768px) {
        main {
            --card-width: 50ch;
            --gap: 1em;
            justify-items: center;
            scroll-padding-inline: 1em;

            padding-inline: calc(50% - var(--card-width) / 2);
        }
    }
</style>
