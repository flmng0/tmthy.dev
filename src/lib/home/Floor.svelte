<script lang="ts">
    import { T } from '@threlte/core'
    import { useTexture } from '@threlte/extras'
    import * as THREE from 'three'
    import { floorTileTextureData } from './data'
    import { buttonLayer } from './constants'

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
</script>

{#await texture then map}
    <T.Mesh
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
