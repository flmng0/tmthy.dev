<script>
    import Logo from '$lib/Logo.svelte'
    import { pages } from '$lib/site'
    import { onMount } from 'svelte'

    let enabled = false
    let hidden = false

    const hiddenMargin = 50
    const totalDuration = 500

    /** @type {HTMLElement} */
    let container

    $: if (!enabled) {
        hidden = false
    }

    onMount(() => {
        const mql = window.matchMedia('(prefers-reduced-motion: no-preference)')

        enabled = mql.matches

        mql.addEventListener('change', () => {
            enabled = mql.matches
        })

        let lastScrollY = window.scrollY
        window.addEventListener('scroll', () => {
            if (!enabled) return

            const scrollY = window.scrollY
            const dy = scrollY - lastScrollY

            hidden = dy > 0 && scrollY > hiddenMargin
            lastScrollY = scrollY
        })

        const delayElems = container.querySelectorAll('[data-delay]')
        delayElems.forEach((elem, i) => {
            const t = i / delayElems.length

            // @ts-ignore
            elem.style.transitionDelay = `${t * totalDuration}ms`
        })
    })
</script>

<nav
    bind:this={container}
    class="w-full bg-gradient-to-b from-flamingo-950/50 pb-1 transition-transform"
    class:-translate-y-full={hidden}
    class:delay-500={hidden}
>
    <ul class="mx-auto flex h-full w-full max-w-[min(100%,40rem)] flex-row flex-nowrap gap-4 px-8">
        <li
            class="grid items-center px-2 transition-transform"
            class:-translate-y-full={hidden}
            data-delay
        >
            <a href="/">
                <div class="aspect-square h-10 text-white">
                    <Logo />
                </div>
            </a>
        </li>

        {#each pages as { href, name }}
            <li class="py-5 transition-transform" class:-translate-y-full={hidden} data-delay>
                <a class="text-lg font-normal text-white underline hover:text-flamingo-200" {href}>
                    {name}
                </a>
            </li>
        {/each}
    </ul>
</nav>
