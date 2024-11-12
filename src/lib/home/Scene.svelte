<script lang="ts">
    import { extend, T, useThrelte } from '@threlte/core'
    import { interactivity, Suspense } from '@threlte/extras'
    import * as THREE from 'three'
    import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
    import { writable } from 'svelte/store'
    import anime from 'animejs'

    import type { AnimationSpec } from './types'

    import Floor from './Floor.svelte'
    import Camera from './Camera.svelte'
    import Title from './Title.svelte'
    import SocialButtons from './SocialButtons.svelte'
    import VolleyballCourt from './VolleyballCourt.svelte'

    import { setHomeContext } from './context'
    import { closeDrawer } from '../Drawer.svelte'

    interface Props {
        onready: () => void
        onfar: (far: boolean) => void
        goHome: ((e: MouseEvent) => void) | undefined
    }
    let { onready, onfar, goHome = $bindable() }: Props = $props()

    extend({ TextGeometry })

    const { controlsEnabled, isFar, controller } = setHomeContext()

    interactivity({
        filter: (hits) => {
            if ($controlsEnabled) return hits
            return []
        },
    })

    let cameraRef = $state<THREE.OrthographicCamera>()
    let animations = writable<AnimationSpec[]>([])

    $effect(() => onfar($isFar))
    goHome = () => {
        $controller.focusLocation(new THREE.Vector3(0, 0, 0))
        $isFar = false
        closeDrawer()
    }

    const { invalidate } = useThrelte()

    const onload = () => {
        onready()

        const timeline = anime.timeline({
            autoplay: false,
            update: () => {
                invalidate()
            },
            complete: () => {
                controlsEnabled.set(true)
            },
        })

        for (const spec of $animations) {
            let { params, offset } = spec()

            timeline.add(params, offset)
        }

        const camera = cameraRef!
        anime({
            targets: camera,
            zoom: camera.zoom * 0.9,
            easing: 'easeInOutSine',
            duration: 700,
            delay: 600,
            update: () => camera.updateProjectionMatrix(),
        })

        timeline.play()
    }
</script>

<Camera bind:ref={cameraRef} />

<T.AmbientLight color={0xffffff} intensity={0.8} />

<T.DirectionalLight
    color={0xffffff}
    intensity={1.5}
    position={[10, 15, -10]}
    oncreate={(ref) => {
        ref.lookAt(0, 0, 0)
    }}
/>

<Floor />

<Suspense final {onload}>
    <Title {animations} />

    <SocialButtons {animations} />

    <VolleyballCourt {animations} scale={1 / 3} />
</Suspense>
