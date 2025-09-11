<script>
  import '$lib/styles.css'
  import { onNavigate } from '$app/navigation'

  import appState from '$lib/appState.svelte'
  import Hero from '$lib/hero/Hero.svelte'
  import Header from './Header.svelte'

  let { children } = $props()

  onNavigate((navigation) => {
    document.body.scrollTo(0, 0)

    if (!document.startViewTransition) return

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })
</script>

<Header />

<Hero title={appState.title} />

{#if appState.ready}
  {@render children()}
{/if}
