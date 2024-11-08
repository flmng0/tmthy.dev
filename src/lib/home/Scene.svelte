<script lang="ts">
    import { extend, T, useThrelte } from '@threlte/core'
    import { Suspense } from '@threlte/extras'
    import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
    import { writable } from 'svelte/store'
    import anime from 'animejs'

    import Floor from './Floor.svelte'
    import Camera from './Camera.svelte'
    import Title from './Title.svelte'

    import type { AnimationSpec } from '.'

    extend({ TextGeometry })

    let { onready } = $props<{ onready: () => void }>()

    let animations = writable<AnimationSpec[]>([])

    const { invalidate } = useThrelte()

    const onload = () => {
        onready()

        const timeline = anime.timeline({
            autoplay: false,
            update: () => {
                invalidate()
            },
        })

        for (const spec of $animations) {
            let { params, offset } = spec()

            timeline.add(params, offset)
        }

        timeline.play()
    }
</script>

<Camera />

<T.AmbientLight color={0xffffff} intensity={0.8} />

<T.DirectionalLight
    color={0xffffff}
    intensity={2}
    position={[10, 15, -10]}
    oncreate={(ref) => {
        ref.lookAt(0, 0, 0)
    }}
/>

<Floor />

<Suspense final {onload}>
    <Title {animations} />
</Suspense>
