<script>
  import { extend, T, useLoader, useThrelte } from '@threlte/core'

  import { FontLoader } from 'three/addons/loaders/FontLoader.js'
  import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'

  import fontData from '$lib/data/font.typeface.json?url'

  import Floor from './Floor.svelte'
  import Title from './Title.svelte'
  import Camera from './Camera.svelte'
  import appState from '$lib/appState.svelte'

  const loader = useLoader(FontLoader)

  const font = loader.load(fontData).then(
    (value) =>
      // Little hack to add delay to the intro of the text.
      new Promise((resolve, _reject) => {
        setTimeout(() => resolve(value), 300)
      })
  )

  extend({ TextGeometry })
  gsap.registerPlugin(ScrollTrigger)

  /** @type {{ title: string }} */
  let { title } = $props()

  const { invalidate } = useThrelte()
  gsap.defaults({
    onUpdate: () => {
      invalidate()
    },
  })
</script>

<Camera />

<T.AmbientLight intensity={0.8} />
<T.DirectionalLight
  intensity={1.5}
  position={[10, 15, -10]}
  oncreate={(ref) => ref.lookAt(0, 0, 0)}
/>

<Floor />

{#each appState.objects.values() as object}
  {@render object()}
{/each}

{#await font then font}
  <Title {title} {font} />
{/await}
