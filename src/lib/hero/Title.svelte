<script>
    import { gsap } from 'gsap'
    import Character from './Character.svelte'
    import { useThrelte } from '@threlte/core'

    /** @type {{title: string, font: object}} */
    let { title, font } = $props()

    let currentTitle = $state(title)

    /** @typedef {import("three").Mesh[]} Refs */

    /** @type {Refs} */
    let refs = $state([])

    const { size } = useThrelte()

    let animationEnabled = () => {
        return document.body.scrollTop < $size.height * 0.8
    }

    /** @param {Refs} refs */
    const positions = (refs) => refs.map((ref) => ref.position)

    const animateIn = () => {
        if (!animationEnabled()) return

        gsap.fromTo(
            positions(refs),
            { y: -2.3 },
            {
                y: -1.3,
                duration: 1,
                ease: 'elastic.out(1,0.3)',
                stagger: { amount: 0.5, from: 'random' },
            }
        )
    }

    /** @param {() => void} onComplete */
    const animateOut = (onComplete) => {
        if (!animationEnabled()) return

        gsap.to(positions(refs), {
            y: -2.3,
            stagger: {
                amount: 0.2,
                from: Math.random() >= 0.5 ? 0 : refs.length - 1,
                onComplete,
            },
        })
    }

    // NOTE: For some reason the order matters here...

    // Handle outro animation
    $effect(() => {
        title
        animateOut(() => (currentTitle = title))
    })

    // Handle intro animation
    $effect(() => {
        currentTitle
        animateIn()
    })
</script>

{#each currentTitle as value, i}
    {@const x = i + Math.round(-currentTitle.length / 2)}

    <Character
        {value}
        {font}
        position.x={x + 0.6}
        position.y={-1.3}
        position.z={0.375}
        bind:ref={refs[i]}
    />
{/each}
