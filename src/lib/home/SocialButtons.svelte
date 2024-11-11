<script lang="ts">
    import * as THREE from 'three'
    import anime from 'animejs'

    import type { icons } from './data'
    import type { AnimatedProps } from './types'

    import IconButton from './IconButton.svelte'
    import { shuffle } from '../util'
    import { setDrawer } from '../Drawer.svelte'
    import DrawerContent from '../DrawerContent.svelte'

    let { animations }: AnimatedProps = $props()

    interface Link {
        linkAction?: string
        href: string
        name: string
        description: string
        icon: keyof typeof icons
        color: THREE.ColorRepresentation
    }

    const socialLinks: Link[] = [
        {
            href: 'https://github.com/flmng0',
            name: 'GitHub',
            description:
                'My GitHub page, where I host most of my programming projects.',
            icon: 'github',
            color: 0x24292e,
        },
        {
            href: 'https://www.linkedin.com/in/timothy-davis-dev',
            name: 'LinkedIn',
            description:
                'My personal LinkedIn page. Visit to connect with me online!',
            icon: 'linkedin',
            color: 0x0077b5,
        },
        {
            linkAction: 'Contact',
            href: 'mailto:tmthydvs@gmail.com',
            name: 'tmthydvs@gmail.com',
            description:
                'Send me a message using the above email for direct communication / inquiries.',
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

{#each socialLinks as { icon, color, href, name, description, linkAction }, i}
    {#snippet linkInfo()}
        <DrawerContent title={name}>
            <p>{description}</p>
            {#snippet buttons()}
                <button>
                    <a {href} target="_blank">{linkAction || 'Visit'}</a>
                </button>
            {/snippet}
        </DrawerContent>
    {/snippet}

    <IconButton
        {icon}
        {color}
        position.x={i * (1 + spacing) - 1}
        position.z={2}
        onclick={(e: MouseEvent) => {
            e.stopPropagation()
            setDrawer(linkInfo)
        }}
        oncreate={(ref) => {
            refs.push(ref)
        }}
    />
{/each}
