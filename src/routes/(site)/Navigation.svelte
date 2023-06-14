<script>
    import Logo from '$lib/Logo.svelte'
    import { pages } from '$lib/site'
    import { onMount } from 'svelte'
    import { tweened } from 'svelte/motion'
    import { cubicInOut, linear } from 'svelte/easing'

    let enabled = false
    let hidden = false

    const hiddenMargin = 50
    const totalDuration = 500

    const borderHue = tweened(310, { duration: totalDuration * 2, easing: cubicInOut })

    $: $borderHue = hidden ? 100 : 310

    /** @type {HTMLElement} */
    let container

    $: if (!enabled) {
        hidden = false
    }

    onMount(() => {
        const mql = window.matchMedia(
            '(max-width: 768px) and (prefers-reduced-motion: no-preference)'
        )

        enabled = mql.matches

        mql.addEventListener('change', () => {
            enabled = mql.matches
        })

        let lastScrollY = window.scrollY
        window.addEventListener('scroll', () => {
            if (!enabled) return

            const scrollY = window.scrollY
            const dy = scrollY - lastScrollY

            hidden = dy >= 0 && scrollY > hiddenMargin
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
    style:border-color={`hsl(${$borderHue}deg, 100%, 50%)`}
    class="w-full border-b-2 bg-flamingo-950 pb-1 shadow-lg transition-transform"
    class:-translate-y-[calc(100%-2px)]={hidden}
    class:delay-500={hidden}
>
    <ul class="mx-auto flex h-full w-full max-w-2xl flex-row flex-nowrap gap-4 px-8">
        <li
            class="grid items-center px-2 transition-transform"
            class:-translate-y-full={hidden}
            data-delay
        >
            <a href="/">
                <div class="h-10 text-white">
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
