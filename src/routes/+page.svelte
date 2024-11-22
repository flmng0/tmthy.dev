<script>
    import appState from '$lib/appState.svelte'
    import Responsive from '$lib/Responsive.svelte'

    appState.title = 'tmthy.dev'
</script>

<svelte:head>
    <title>Tim Davis' Web Development Portfolio | tmthy.dev</title>
</svelte:head>

<!-- TODO: Utilise this for mobile navigation
<main>
    <Responsive>
        This is a test
        {#snippet mini()}
            This is not a test
        {/snippet}
    </Responsive>
</main>
-->
