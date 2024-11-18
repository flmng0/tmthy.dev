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

    /** @type {HTMLElement | undefined} */
    let content = $state()

    /** @type {IntersectionObserverCallback} */
    const onintersect = (entries) => {
        const entry = entries[0]
        appState.contentIntersecting = entry.isIntersecting
    }

    /** @type {IntersectionObserver | undefined} */
    let observer

    $effect(() => {
        if (!content) return

        if (observer === undefined) {
            const margin = window.innerHeight / 5
            observer = new IntersectionObserver(onintersect, {
                root: document.body,
                rootMargin: `-${margin}px`,
            })
        }

        observer.observe(content)

        return () => {
            if (observer && content) {
                observer.unobserve(content)
            }
        }
    })
</script>

{#if appState.ready}
    <Header />
{/if}

<Hero title={appState.title} />

<main class="page-content" bind:this={content}>
    {@render children()}
</main>

<style>
    .page-content {
        position: relative;
        z-index: 1;
    }
</style>
