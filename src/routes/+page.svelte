<script>
    import Logo from '$lib/Logo.svelte'
    import { pages } from '$lib/site'
    import * as icons from '$lib/icons'

    const socials = [
        {
            href: 'https://github.com/flmng0',
            title: 'GitHub',
            icon: icons.MdiGitHub,
        },
        {
            href: 'https://www.linkedin.com/in/timothy-davis-bb749b209/',
            title: 'LinkedIn',
            icon: icons.MdiLinkedIn,
        },
        {
            href: 'mailto:tmthydvs@gmail.com',
            title: 'Email',
            icon: icons.MdiEmail,
        },
    ]
</script>

<svelte:head>
    <title>Home | tmthy.dev</title>
</svelte:head>

<div class="wrapper -z-50 flex flex-col place-items-center bg-flamingo-950 py-9">
    <main class="container prose z-10 flex-grow space-y-8 px-5 prose-hr:my-4">
        <section>
            <h1 class="mb-5 leading-relaxed">
                Hello! I'm <span class="feature-text">Timothy Davis</span>
            </h1>

            <nav
                aria-label="social links"
                class="not-prose flex flex-shrink flex-row flex-wrap gap-3"
            >
                {#each socials as { href, icon, title }}
                    <a
                        {href}
                        aria-label={title}
                        class="flex flex-row flex-nowrap items-center gap-1 whitespace-nowrap rounded-md bg-flamingo-900 px-3 py-2"
                    >
                        <svelte:component this={icon} />
                        {title}
                    </a>
                {/each}
            </nav>

            <hr />

            <p>
                This website is under active development, I only started (re)developing it on the
                7th of March 2023.
            </p>
            <p>
                I created this website as a place to store all of my little projects, and to
                distract myself from work.
            </p>
            <p>
                Eventually this will be a fully fledged portfolio. As you could probably tell, that
                is not the case yet.
            </p>
        </section>
    </main>

    <footer class="z-10">
        <nav aria-label="site links" class="flex flex-row gap-2">
            {#each pages as { href, name }}
                {#if href !== '/'}
                    <a
                        {href}
                        class="not-prose px-1 text-lg font-normal text-white underline hover:text-flamingo-200"
                    >
                        {name}
                    </a>
                {/if}
            {/each}
        </nav>
    </footer>

    <figure
        class="pointer-events-none fixed bottom-0 right-0 origin-bottom translate-y-16 scale-125 text-flamingo-800"
    >
        <Logo />
    </figure>
</div>

<style lang="postcss">
    .wrapper {
        min-height: 100vh;
        min-height: 100lvh;
    }

    .feature-text {
        @apply whitespace-nowrap bg-flamingo-800 tracking-wide text-fuchsia;
    }

    .feature-text::selection {
        @apply bg-flamingo-900 text-fuchsia;
    }

    .feature-text,
    .feature-text::selection {
        @apply px-4 py-1;
    }
</style>
