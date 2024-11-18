<script>
    import { gsap } from 'gsap'
    import Character from './Character.svelte'

    /** @type {{title: string, font: object}} */
    let { title, font } = $props()

    let currentTitle = $state(title)

    /** @typedef {import("three").Mesh[]} Refs */

    /** @type {Refs} */
    let refs = $state([])

    /** @param {Refs} refs */
    const positions = (refs) => refs.map((ref) => ref.position)

    const animateIn = () => {
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
        gsap.to(positions(refs), {
            y: -2.3,
            stagger: {
                amount: 0.2,
                from: Math.random() >= 0.5 ? 0 : refs.length - 1,
                onComplete,
            },
        })
    }

    $effect(() => {
        title
        animateOut(() => (currentTitle = title))
    })

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
        position.z={0.375}
        bind:ref={refs[i]}
    />
{/each}
