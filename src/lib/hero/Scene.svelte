<script>
    import { extend, T, useLoader, useThrelte } from '@threlte/core'

    import { FontLoader } from 'three/addons/loaders/FontLoader.js'
    import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

    import { gsap } from 'gsap'

    import fontData from '$lib/data/font.typeface.json?url'

    import Floor from './Floor.svelte'
    import Title from './Title.svelte'
    import { onMount } from 'svelte'

    const loader = useLoader(FontLoader)
    const font = loader.load(fontData)

    extend({ TextGeometry })

    /** @type {{ title: string }} */
    let { title } = $props()

    const { invalidate, size } = useThrelte()
    gsap.defaults({
        onUpdate: () => {
            invalidate()
        },
    })

    const distance = 10

    const maxTextLength = 10
    const textPadding = 1

    let width = maxTextLength + textPadding * 2
    let height = $derived(width * ($size.height / $size.width))

    let updater = () => {}

    $effect(() => {
        height
        updater()
    })
</script>

<T.OrthographicCamera
    makeDefault
    manual
    left={-width / 2}
    right={width / 2}
    top={height / 2}
    bottom={-height / 2}
    position={distance}
    oncreate={(ref) => {
        ref.lookAt(0, 0, 0)
        const upAmount = 1.5
        // "center" the text, and move it upwards slightly (in viewport space)
        ref.position
            .add({ x: 0.5, y: 0, z: -0.5 })
            .add({ x: upAmount, y: 0, z: upAmount })

        updater = () => ref.updateProjectionMatrix()
    }}
/>

<T.AmbientLight intensity={0.8} />
<T.DirectionalLight
    intensity={1.5}
    position={[10, 15, -10]}
    oncreate={(ref) => ref.lookAt(0, 0, 0)}
/>

<Floor />

{#await font then font}
    <Title {title} {font} />
{/await}
