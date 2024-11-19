<script>
    import appState from '$lib/appState.svelte'

    appState.title = 'Projects'
</script>

<svelte:head>
    <title>View Projects | tmthy.dev</title>
</svelte:head>

<main>
    <hgroup class="glass">
        <h1>Projects</h1>
        <p>Porfolio of larger, public, projects that I've made.</p>
    </hgroup>

    <nav>
        <article class="glass">
            <h2>Volley Kit</h2>
            <p>
                Real-time synchronized scoring app, mainly for volleyball. This
                was developed using Phoenix and Elixir.
            </p>
            <nav>
                <a class="button" href="https://github.com/flmng0/volley_kit">
                    View Source
                </a>
                <a class="button" href="https://volley-kit.tmthy.dev">Visit</a>
            </nav>
        </article>
    </nav>
</main>

<style>
    hgroup {
        padding: 0.8em 1.2em;
        border-top-width: thin;
    }

    main > nav {
        display: grid;
        flex-flow: column;
    }

    article {
        padding: 0.8em 1.8em;
        border-width: thin;
    }
    article > p {
        color: hsl(0 0 25% / 0.9);
    }
    article > nav {
        display: flex;
        flex-flow: row wrap;
        justify-content: end;
        gap: 1em;
    }
    article > nav a {
        background-color: hsl(0 0 20%);
        color: hsl(0 0 80%);
        padding: 0.5em 0.9em;
    }

    @media screen and (min-width: 768px) {
        hgroup {
            width: min(66ch, 100%);
            border-radius: 0.5em;
            border-width: thin;
            margin-bottom: 1em;
        }
        main {
            margin: 2em;
            margin-bottom: 1em;
        }
        main > nav {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(35ch, 1fr));
        }

        article {
            border-radius: 0.5em;
        }
    }
</style>
