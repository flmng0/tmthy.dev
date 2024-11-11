<script lang="ts">
    import { T } from '@threlte/core'
    import { useTexture } from '@threlte/extras'
    import * as THREE from 'three'
    import { floorTileTextureData } from './data'
    import { buttonLayer } from './constants'
    import { closeDrawer } from '../Drawer.svelte'

    interface Props {
        ref?: THREE.Mesh
    }
    let { ref = $bindable() }: Props = $props()

    const floorSize = 256

    const texture = useTexture(floorTileTextureData, {
        transform: (texture) => {
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(floorSize, floorSize)

            // So that unit coordinates are in the middle of squares.
            texture.offset.set(-0.5, -0.5)
            return texture
        },
    })

    const onclick = (e: MouseEvent) => {
        e.stopPropagation()
        closeDrawer()
    }
</script>

{#await texture then map}
    <T.Mesh
        bind:ref
        interactive
        onpointerenter={(e: PointerEvent) => e.stopPropagation()}
        onpointerleave={(e: PointerEvent) => e.stopPropagation()}
        {onclick}
        position.y={-0.5}
        rotation.x={Math.PI * -0.5}
        oncreate={(ref) => {
            ref.layers.enable(buttonLayer)
        }}
    >
        <T.PlaneGeometry args={[floorSize, floorSize]} />
        <T.MeshBasicMaterial {map} />
    </T.Mesh>
{/await}
