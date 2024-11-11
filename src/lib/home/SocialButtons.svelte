<script lang="ts">
    import * as THREE from 'three'
    import anime from 'animejs'

    import type { icons } from './data'
    import type { AnimatedProps } from './types'

    import IconButton from './IconButton.svelte'
    import { goto, shuffle } from '../util'
    import { setModal } from '../Modal.svelte'

    let { animations }: AnimatedProps = $props()

    interface Link {
        href: string
        name: string
        icon: keyof typeof icons
        color: THREE.ColorRepresentation
    }

    const socialLinks: Link[] = [
        {
            href: 'https://github.com/flmng0',
            name: 'GitHub',
            icon: 'github',
            color: 0x24292e,
        },
        {
            href: 'https://www.linkedin.com/in/timothy-davis-dev',
            name: 'LinkedIn',
            icon: 'linkedin',
            color: 0x0077b5,
        },
        {
            href: 'mailto:tmthydvs@gmail.com',
            name: 'Email to tmthydvs@gmail.com',
            icon: 'email',
            color: 0xea7b12,
        },
    ]

    const spacing = 1

    let refs: THREE.Group[] = $state([])

    $animations.push(() => {
        shuffle(refs)

        return {
            params: {
                targets: refs.map((r) => r.position),
                y: [-1.0, -0.5],
                delay: anime.stagger(100),
            },
        }
    })
</script>

{#each socialLinks as { icon, color, href }, i}
    {#snippet linkInfo()}
        <span>Test {href}</span>
    {/snippet}

    <IconButton
        {icon}
        {color}
        position.x={i * (1 + spacing) - 1}
        position.z={2}
        onclick={(e: MouseEvent) => {
            e.stopPropagation()
            setModal(linkInfo, 'bottom')
            //goto(href)
        }}
        oncreate={(ref) => {
            refs.push(ref)
        }}
    />
{/each}
