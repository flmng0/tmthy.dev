<script>
    import { onMount } from 'svelte'
    import { tweened } from 'svelte/motion'

    let enabled = false
    let hidden = false

    const hiddenMargin = 50
    const totalDuration = 500

    const borderHue = tweened(100, { duration: totalDuration * 2 })

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
    })
</script>
