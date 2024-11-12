<script lang="ts">
    import { T, useLoader } from '@threlte/core'
    import { useSuspense } from '@threlte/extras'
    import * as THREE from 'three'
    import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
    import type { ComponentProps, Snippet } from 'svelte'

    import { icons, iconViewBoxSize } from './data'
    import { spring } from 'svelte/motion'
    import Focusable from './Focusable.svelte'

    interface Props extends ComponentProps<typeof T.Group> {
        icon: keyof typeof icons
        color: THREE.ColorRepresentation
        details: Snippet
    }

    let { icon, color, details, ref = $bindable(), ...rest }: Props = $props()

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

    const idleHeight = -0.5
    const hoverHeight = -0.3
    const y = spring(idleHeight, {
        stiffness: 0.2,
        damping: 0.4,
    })

    const activeOffset = 0.1
</script>

{#await iconSvg then icon}
    <Focusable
        component={T.Group}
        bind:ref
        {details}
        {...rest}
        onidle={() => ($y = idleHeight)}
        onhover={() => ($y = hoverHeight)}
        onactive={() => ($y -= activeOffset)}
        oninactive={() => ($y += activeOffset)}
        position.y={$y}
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
    </Focusable>
{/await}
