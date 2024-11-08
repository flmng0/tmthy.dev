<script lang="ts">
    import { T, useLoader } from '@threlte/core'
    import { useSuspense } from '@threlte/extras'
    import * as THREE from 'three'
    import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
    import anime from 'animejs'

    import { fontJsonData } from './data'
    import type { AnimatedProps } from '.'

    let { animations }: AnimatedProps = $props()

    let group: THREE.Group | undefined = $state()

    $animations.push(() => {
        return {
            params: {
                targets: group!.children.map((c) => c.position),
                y: 1.0,
                duration: 700,
                delay: anime.stagger(90, { start: 700 }),
                easing: 'easeOutElastic',
            },
        }
    })

    const title = 'tmthy.dev'
    const letterSpacing = 1

    const textParameters = {
        size: 1,
        depth: 1,
        bevelEnabled: true,
        bevelOfset: 0,
        bevelSize: 0.05,
        bevelThickness: 0.05,
        bevelSegments: 1,
    }

    const suspend = useSuspense()
    const font = suspend(useLoader(FontLoader).load(fontJsonData))
</script>

{#await font then font}
    <T.Group position={[0.5, -2.3, 0.375]} bind:ref={group}>
        {#each title as char, i}
            <T.Mesh
                position.x={(i - Math.floor(title.length / 2)) * letterSpacing}
                rotation.x={-Math.PI / 2}
            >
                <T.TextGeometry args={[char, { font, ...textParameters }]} />
                <T.MeshPhongMaterial />
            </T.Mesh>
        {/each}
    </T.Group>
{/await}
