<script>
  import appState from '$lib/appState.svelte'
  import { onMount } from 'svelte'

  /**
   * @typedef {Object} Props
   *
   * @property {string} key
   * @property {import("svelte").Snippet} children
   * @property {import("svelte").Snippet} title
   * @property {import("svelte").Snippet} [actions]
   * @property {import("svelte").Snippet} [object]
   * @property {{ x: number, z: number }} position
   */

  /** @type {Props} */
  let { key, children, title, actions, object, position } = $props()

  /** @type {HTMLElement | undefined} */
  let trigger = $state()

  let active = $state(false)

  const cursor = $derived(active ? 'default' : 'pointer')

  onMount(() => {
    if (!trigger) return

    /** @type {import("$lib/appState.svelte").ScrollTrigger} */
    const scrollTrigger = {
      key,
      trigger,
      target: { ...position, y: 0 },
      ontoggle: (a) => {
        active = a
      },
    }
    object && appState.objects.set(key, object)

    appState.scrollTriggers.push(scrollTrigger)

    return () => {
      object && appState.objects.delete(key)

      const idx = appState.scrollTriggers.findIndex((i) => i.key == key)
      if (idx !== -1) {
        appState.scrollTriggers.splice(idx, 1)
      }
    }
  })

  const scrollIntoView = () => {
    trigger?.scrollIntoView({ behavior: 'smooth', inline: 'center' })
  }
</script>

<button onclick={scrollIntoView} style:cursor aria-label="Focus this card">
  <article class="project-card glass" bind:this={trigger}>
    <h2>
      {@render title()}
    </h2>

    {@render children()}

    {#if actions}
      <nav>
        {@render actions?.()}
      </nav>
    {/if}
  </article>
</button>

<style>
  @import '$lib/media.css';

  :where(button) {
    all: unset;
    cursor: pointer;
  }

  article {
    padding: 0.9em 1.5em;
    border-width: thin;
    color: hsl(0 0 25% / 0.9);
    line-height: 1.7em;
    border-radius: 0.5em 0.5em 0 0;

    > h2 {
      color: var(--color-text);
    }

    > nav {
      margin-top: 2em;
      display: flex;
      flex-flow: row wrap;
      justify-content: end;
      gap: 1em;
    }

    @media (--mobile) {
      padding: 1.2em 1.8em;
    }
  }
</style>
