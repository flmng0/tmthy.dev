<script>
  import appState from '$lib/appState.svelte'
  import ContentWrapper from '$lib/ContentWrapper.svelte'

  appState.title = 'tmthy.dev'
</script>

<svelte:head>
  <title>Tim Davis' Web Development Portfolio | tmthy.dev</title>
  <meta
    name="description"
    content="Learn more about a passionate, broadly skilled developer from Australia. Tim Davis' porfolio website."
  />
</svelte:head>

<ContentWrapper>
  <main>
    <hgroup class="glass">
      <h1>Hello, I'm Tim Davis!</h1>
    </hgroup>
  </main>
</ContentWrapper>

<style>
  main {
    display: grid;
    width: min(66ch, 100%);
    height: 100%;
    align-items: end;
    margin-inline: auto;
  }

  hgroup {
    margin-inline: 1em;
    border-radius: 0.3em;
    border-width: thin;
    padding: 0.8em 1.2em;
  }
</style>
