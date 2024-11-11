<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import { useCursor, useTexture } from '@threlte/extras'
    import * as THREE from 'three'

    import type { AnimatedProps } from './types'
    import { courtHalfData } from './data'
    import { spring } from 'svelte/motion'
    import { onDestroy } from 'svelte'
    import { init } from 'astro/virtual-modules/prefetch.js'
    import { goto } from '../util'

    interface Props extends AnimatedProps {
        scale: number
    }
    let { animations, scale: initialScale }: Props = $props()

    let courtHalfTexture = useTexture(courtHalfData, {
        transform: (ref) => {
            ref.magFilter = THREE.NearestFilter
        },
    })

    let ref = $state<THREE.Group>()

    $animations.push(() => {
        return {
            params: {
                targets: ref!.position,
                y: [20, 0.001],
                duration: 500,
                easing: 'easeOutCubic',
            },
        }
    })

    const { hovering, onPointerEnter, onPointerLeave } = useCursor('pointer')

    type Side = 'a' | 'b'
    function sided<T>(side: Side, whenA: T, whenB: T) {
        return side === 'a' ? whenA : whenB
    }

    const scale = spring(initialScale, {
        stiffness: 0.3,
        damping: 0.3,
    })

    $effect(() => {
        $scale = ($hovering ? 1.1 : 1.0) * initialScale
    })

    const halfSize = 9 // standard court half length in metres

    const poleSize = 0.1
    const poleHeight = 2.43 // standard men's net height in metres
    const poleOffset = 0.5

    const netWidth = halfSize + 1.8 * poleOffset
    const netHeight = 1.25
    const netDepth = poleSize / 3

    const tapeHeight = 0.2
</script>

{#await courtHalfTexture then courtHalfTexture}
    <T.Group
        bind:ref
        scale={$scale}
        position.x={-6.5}
        position.z={1}
        interactive
        onclick={() => goto('https://volley-kit.tmthy.dev')}
        onpointerenter={onPointerEnter}
        onpointerleave={onPointerLeave}
    >
        {@render half(courtHalfTexture, 'a')}
        {@render half(courtHalfTexture, 'b')}

        {@render pole('a')}
        {@render pole('b')}

        {@render net()}
    </T.Group>
{/await}

{#snippet half(texture: THREE.Texture, side: Side)}
    <T.Mesh
        rotation.x={Math.PI * -0.5}
        position.z={sided(side, 0.5, -0.5) * halfSize}
        rotation.z={sided(side, 0, Math.PI)}
    >
        <T.PlaneGeometry args={[halfSize, halfSize]} />
        <T.MeshPhongMaterial map={texture} />
    </T.Mesh>
{/snippet}

{#snippet pole(side: Side)}
    <T.Mesh
        position.x={sided(side, 1, -1) * (halfSize / 2 + poleOffset)}
        position.y={poleHeight / 2}
    >
        <T.BoxGeometry args={[poleSize, poleHeight, poleSize]} />
        <T.MeshPhongMaterial color={0x5050c0} />
    </T.Mesh>
{/snippet}

{#snippet net()}
    <T.Group position.y={poleHeight - netHeight / 2}>
        <!-- The net itself -->
        <T.Mesh>
            <T.BoxGeometry args={[netWidth, netHeight, netDepth]} />
            <T.MeshPhongMaterial transparent={true} opacity={0.7} />
        </T.Mesh>

        <!-- The net ribbon / tape -->
        <T.Mesh position.y={(netHeight - tapeHeight) / 2}>
            <T.BoxGeometry args={[netWidth, tapeHeight, netDepth + 0.002]} />
            <T.MeshPhongMaterial />
        </T.Mesh>
    </T.Group>
{/snippet}
