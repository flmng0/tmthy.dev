<script>
    import appState from '$lib/appState.svelte'
    import ContentWrapper from '$lib/ContentWrapper.svelte'

    appState.title = 'tmthy.dev'
</script>

<svelte:head>
    <title>Tim Davis' Web Development Portfolio | tmthy.dev</title>
</svelte:head>

<ContentWrapper>
    <main class="glass">
        <hgroup>
            <h1>Hello, I'm Tim Davis!</h1>
            <p>This site is currently under construction, sorry!</p>
        </hgroup>
    </main>
</ContentWrapper>

<style>
    main {
        margin-inline: 1em;
        margin-bottom: 0.5em;
        border-radius: 0.3em;
        border-width: thin;
        padding: 0.8em 1.2em;
    }
</style>
