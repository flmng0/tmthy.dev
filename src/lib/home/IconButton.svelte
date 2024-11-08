<script lang="ts">
    import { T, useLoader, useThrelte } from '@threlte/core'
    import { useCursor, useSuspense } from '@threlte/extras'
    import * as THREE from 'three'
    import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
    import type { ComponentProps } from 'svelte'
    import anime from 'animejs'

    import { icons, iconViewBoxSize } from './data'
    import { useHomeContext } from './context'

    interface Props extends ComponentProps<typeof T.Group> {
        icon: keyof typeof icons
        color: THREE.ColorRepresentation
    }

    let { icon, color, ref = $bindable(), ...rest }: Props = $props()

    const suspend = useSuspense()
    const iconSvg = suspend(useLoader(SVGLoader).load(icons[icon]))

    const buttonHeight = 0.5
    const buttonSize = 1

    const extrusionSettings: THREE.ExtrudeGeometryOptions = {
        bevelEnabled: false,
        steps: 2,
        depth: 10,
    }

    const iconSize = 0.85
    const iconScale = iconSize / iconViewBoxSize

    const { invalidate } = useThrelte()
    const { hovering, onPointerEnter, onPointerLeave } = useCursor('pointer')
    const { controlsEnabled } = useHomeContext()

    $effect(() => {
        if (!ref || !$controlsEnabled) return

        if ($hovering) {
            anime.remove(ref.position)
            anime({
                targets: ref.position,
                duration: 200,
                y: -0.3,
                update: invalidate,
            })
        } else {
            anime.remove(ref.position)
            anime({
                targets: ref.position,
                duration: 200,
                y: -0.5,
                update: invalidate,
            })
        }
    })
</script>

{#await iconSvg then icon}
    <T.Group
        bind:ref
        {...rest}
        interactive
        onpointerenter={onPointerEnter}
        onpointerleave={onPointerLeave}
    >
        <T.Mesh name="button-box">
            <T.BoxGeometry args={[buttonSize, buttonHeight, buttonSize]} />
            <T.MeshPhongMaterial {color} />
        </T.Mesh>
        <T.Group
            scale={iconScale}
            position.y={buttonHeight / 2 + 0.001}
            position.x={-iconSize / 2}
            position.z={-iconSize / 2}
            rotation.x={Math.PI / 2}
        >
            {#each icon.paths as path}
                <T.Mesh name="button-icon">
                    <T.ExtrudeGeometry
                        args={[SVGLoader.createShapes(path), extrusionSettings]}
                    />
                    <T.MeshPhongMaterial />
                </T.Mesh>
            {/each}
        </T.Group>
    </T.Group>
{/await}
