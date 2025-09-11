<script>
  import { T } from '@threlte/core'
  import * as THREE from 'three'

  import courtHalfUrl from '$lib/data/court-half.png'
  import { useTexture } from '@threlte/extras'

  /** @type {import("svelte").ComponentProps<typeof T.Group>} */
  let props = $props()

  let courtHalfTexture = useTexture(courtHalfUrl, {
    transform: (ref) => {
      ref.magFilter = THREE.NearestFilter
    },
  })

  /** @typedef {"a" | "b"} Side */

  /**
   * @template T
   * @param {Side} side
   * @param {T} whenA
   * @param {T} whenB
   */
  const sided = (side, whenA, whenB) => (side === 'a' ? whenA : whenB)

  const halfSize = 9 // standard court half length in metres

  const poleSize = 0.1
  const poleHeight = 2.43 // standard men's net height in metres
  const poleOffset = 0.5

  const netWidth = halfSize + 1.8 * poleOffset
  const netHeight = 1.25
  const netDepth = poleSize / 3

  const tapeHeight = 0.2

  const scale = 1 / 3
</script>

{#await courtHalfTexture then texture}
  <T.Group {...props} {scale}>
    {@render half(texture, 'a')}
    {@render half(texture, 'b')}

    {@render pole('a')}
    {@render pole('b')}

    {@render net()}
  </T.Group>
{/await}

{#snippet half(/** @type {THREE.Texture} */ texture, /** @type {Side} */ side)}
  <T.Mesh
    rotation.x={Math.PI * -0.5}
    position.z={sided(side, 0.5, -0.5) * halfSize}
    rotation.z={sided(side, 0, Math.PI)}
  >
    <T.PlaneGeometry args={[halfSize, halfSize]} />
    <T.MeshPhongMaterial map={texture} />
  </T.Mesh>
{/snippet}

{#snippet pole(/** @type {Side} */ side)}
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
