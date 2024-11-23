<script>
    import { page } from '$app/stores'
    import appState from '$lib/appState.svelte'

    import { Close, GitHub, HamburgerMenu, LinkedIn } from '$lib/icons'
    import Responsive, { queries } from '$lib/Responsive.svelte'

    const pages = [
        { href: '/', name: 'Home' },
        { href: '/projects', name: 'Projects' },
        // One day this page will be back
        //{ href: '/sketches', name: 'Sketches' },
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

    /** @param {string} href */
    const current = (href) => $page.url.pathname === href

    let open = $state(false)

    $effect(() => {
        if (queries.mobile.matches) {
            open = false
        }
    })
</script>

{#snippet links(
    /** @type {import("svelte/elements").HTMLAnchorAttributes} */ props
)}
    {#each pages as { href, name }, i}
        <a
            {...props}
            {href}
            aria-current={current(href) ? 'page' : null}
            class="slide-down"
            style:--delay={0.2 + 0.1 * i + 's'}
        >
            {name}
        </a>
    {/each}
{/snippet}

<header class="glass" class:ready={appState.ready}>
    <div class="mobile-links pages" class:open>
        {@render links({
            onclick: () => {
                open = false
            },
        })}
    </div>
    <nav>
        <section class="pages">
            <Responsive>
                <button
                    class="mobile-toggle"
                    aria-label={(open ? 'Close' : 'Show') + ' Navigation Links'}
                    onclick={() => (open = !open)}
                >
                    {#if open}
                        <Close />
                    {:else}
                        <HamburgerMenu />
                    {/if}
                </button>

                {#snippet mobile()}
                    {@render links()}
                {/snippet}
            </Responsive>
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

    header {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 10;
        display: flex;
        flex-flow: column;
        isolation: isolate;

        border-bottom-width: thin;
        --inline-padding: 1rem;
    }

    header.ready,
    .ready .slide-down {
        animation-play-state: running;
    }

    header,
    .slide-down {
        animation: 400ms slideDown ease-out both paused;
        animation-delay: calc(500ms + var(--delay, 0s));
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

        text-transform: uppercase;

        padding-inline: var(--inline-padding);
    }

    nav a {
        display: inline-block;
    }

    .mobile-links {
        position: sticky;
        overflow: hidden;
        top: 0;
        max-height: 0;
        transition: 200ms max-height ease-out;
        display: flex;

        flex-direction: column;
        text-align: center;
    }
    .mobile-links.open {
        max-height: 10em;
    }
    .mobile-links a {
        padding-block: 1em;
    }

    .mobile-toggle {
        font-size: 1.5em;
        background-color: unset;
        color: var(--color-text);
        aspect-ratio: 1;
        width: 1em;
        height: auto;
        cursor: pointer;
        padding: 0;
        margin-block: 0.5em;
    }

    .pages.mobile-links a[aria-current='page']::before {
        background-image: linear-gradient(to right, var(--gradient-steps)),
            linear-gradient(to left, var(--gradient-steps));
    }

    .pages a {
        --gradient-steps: hsl(var(--accent-h) 50% 50%),
            hsl(var(--accent-h) 50% 50%) 2px,
            hsl(var(--accent-h) 70% 50% / 0.3) 2px, transparent 0.35em;
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

        background-image: linear-gradient(to bottom, var(--gradient-steps));
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
