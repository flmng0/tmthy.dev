<script lang="ts">
    import { T } from '@threlte/core'
    import { useTexture } from '@threlte/extras'
    import * as THREE from 'three'

    import type { AnimatedProps } from './types'
    import { courtHalfData } from './data'
    import { spring } from 'svelte/motion'
    import DrawerContent from '../DrawerContent.svelte'
    import Focusable from './Focusable.svelte'

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
            offset: '-=700',
        }
    })

    type Side = 'a' | 'b'
    function sided<T>(side: Side, whenA: T, whenB: T) {
        return side === 'a' ? whenA : whenB
    }

    const scale = spring(initialScale, {
        stiffness: 0.3,
        damping: 0.3,
    })

    const position = new THREE.Vector3(-6.5, 0.001, 1)

    const halfSize = 9 // standard court half length in metres

    const poleSize = 0.1
    const poleHeight = 2.43 // standard men's net height in metres
    const poleOffset = 0.5

    const netWidth = halfSize + 1.8 * poleOffset
    const netHeight = 1.25
    const netDepth = poleSize / 3

    const tapeHeight = 0.2
</script>

{#snippet info()}
    <DrawerContent title="VolleyKit">
        <p>
            Real-time synchronised scoring application made with Phoenix and
            Elixir.
        </p>

        {#snippet buttons()}
            <button>
                <a href="https://github.com/flmng0/volley_kit" target="_blank">
                    View Source
                </a>
            </button>
            <button>
                <a href="https://volley-kit.tmthy.dev" target="_blank">Visit</a>
            </button>
        {/snippet}
    </DrawerContent>
{/snippet}

{#await courtHalfTexture then courtHalfTexture}
    <Focusable
        component={T.Group}
        bind:ref
        details={info}
        onPointerOver="pointer"
        onhover={() => ($scale = 1.1 * initialScale)}
        onidle={() => ($scale = initialScale)}
        onactive={() => ($scale *= 0.95)}
        oninactive={() => ($scale /= 0.95)}
        scale={$scale}
        position={position.toArray()}
    >
        {@render half(courtHalfTexture, 'a')}
        {@render half(courtHalfTexture, 'b')}

        {@render pole('a')}
        {@render pole('b')}

        {@render net()}
    </Focusable>
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
