<script>
    import '$lib/styles.css'
    import { page } from '$app/stores'
    import { onNavigate } from '$app/navigation'

    import appState from '$lib/appState.svelte'
    import Hero from '$lib/hero/Hero.svelte'
    import GitHub from '$lib/icons/GitHub.svelte'
    import LinkedIn from '$lib/icons/LinkedIn.svelte'

    const pages = [
        { href: '/', name: 'Home' },
        { href: '/projects', name: 'Projects' },
        { href: '/sketches', name: 'Sketches' },
    ]

    const iconLinks = [
        {
            href: 'https://github.com/flmng0',
            icon: GitHub,
            color: '#24292e',
            name: 'GitHub',
        },
        {
            href: 'https://www.linkedin.com/in/timothy-davis-dev',
            icon: LinkedIn,
            color: '#0077b5',
            name: 'LinkedIn',
        },
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
        <section class="pages">
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

        <section class="socials">
            {#each iconLinks as { href, icon: Icon, color, name }}
                <a {href} aria-label={name} style:--color={color}>
                    <Icon />
                </a>
            {/each}
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
    }

    .pages a {
        text-decoration: none;
        padding: 0.6em 1em;
        position: relative;
    }

    .pages a:hover {
        background-color: hsl(0 0 50%/ 0.1);
        outline: solid thin hsl(0 0 50% / 0.3);
    }
    .pages a:active {
        background-color: hsl(0 0 50% / 0.3);
    }

    .pages a[aria-current='page'] {
        font-weight: 500;
    }

    .pages a[aria-current='page']::before {
        content: '';
        position: absolute;
        inset: 0;

        background-image: linear-gradient(
            to bottom,
            hsl(var(--accent-h) 50% 50%),
            hsl(var(--accent-h) 50% 50%) 2px,
            hsl(var(--accent-h) 70% 50% / 0.3) 2px,
            transparent 0.35em
        );
        background-color: hsl(0 0 50% / 0.08);
        border-inline: solid thin hsl(0 0 50% / 0.3);

        view-transition-name: current-page-indicator;
    }

    .socials {
        display: flex;
        flex-flow: row;
        gap: 0.5em;
    }
    .socials a {
        font-size: 1.5rem;
        width: 1em;
        height: 1em;
        border-radius: 0.2em;
    }
    .socials a:hover {
        color: var(--color);
        outline: solid thin hsl(0 0 20% / 0.5);
        background-color: hsl(0 0 90% / 0.4);
    }
    .socials a:active {
        outline-width: 2px;
        background-color: hsl(0 0 90% / 0.7);
    }
</style>
