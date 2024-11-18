<script>
    import '$lib/styles.css'

    import Hero from '$lib/hero/Hero.svelte'

    import appState from '$lib/appState.svelte'
    import { page } from '$app/stores'
    import { onNavigate } from '$app/navigation'

    const pages = [
        { href: '/', name: 'Home' },
        { href: '/projects', name: 'Projects' },
        { href: '/sketches', name: 'Sketches' },
    ]

    let { children } = $props()

    onNavigate((navigation) => {
        if (!document.startViewTransition) return

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve()
                await navigation.complete
            })
        })
    })

    /** @param {string} href */
    const current = (href) => $page.url.pathname === href
</script>

<header class:ready={appState.ready}>
    <nav>
        <section>
            {#each pages as { href, name }, i}
                <a
                    {href}
                    aria-current={current(href) ? 'page' : null}
                    class="slide-down"
                    style:--delay={0.2 + 0.1 * i + 's'}
                >
                    {name}
                </a>
            {/each}
        </section>

        <section>
            <span>A</span>
            <span>B</span>
        </section>
    </nav>
</header>

<Hero title={appState.title} />

<main>
    {@render children()}
</main>

<style>
    @keyframes slideDown {
        from {
            opacity: 0;
            translate: 0 -100%;
        }
        60% {
            opacity: 1;
        }
        to {
            translate: 0 0;
        }
    }

    main {
        position: absolute;
        background: white;
    }

    header {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;

        color: hsl(0 0 25%);
        border-bottom: thin solid hsl(0 0 55% / 0.8);

        background-color: hsl(0 0 80% / 0.8);
    }

    @supports (backdrop-filter: blur(5px) saturate(150%)) {
        header {
            background-color: hsl(0 0 100% / 0.3);
            backdrop-filter: blur(7px) saturate(150%);
        }
    }

    header,
    .slide-down {
        animation: 400ms slideDown ease-out both paused;
        animation-delay: calc(1s + var(--delay, 0s));
    }
    header.ready,
    header.ready .slide-down {
        animation-play-state: running;
    }

    nav {
        gap: 1em;
        height: auto;
        width: min(66ch, 100%);
        margin-inline: auto;

        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;

        font-family: var(--font-mono);
        font-size: clamp(0.9rem, 0.9rem + 0.8vw, 1.25rem);
        text-transform: uppercase;
    }

    nav a {
        display: inline-block;
        text-decoration: none;
        padding: 0.6em 1em;
        position: relative;
    }

    nav a[aria-current='page'] {
        font-weight: 500;
    }

    nav a[aria-current='page']::before {
        content: '';
        position: absolute;
        inset: 0;

        background-image: linear-gradient(
            to bottom,
            hsl(310deg 50% 50%),
            hsl(310deg 50% 50%) 2px,
            hsl(310deg 50% 50% / 0.3) 2px,
            transparent 0.35em
        );
        background-color: hsl(0 0 50% / 0.08);
        border-inline: solid thin hsl(0 0 50% / 0.3);

        view-transition-name: current-page-indicator;
    }
</style>
