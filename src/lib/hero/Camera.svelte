<script>
    import * as THREE from 'three'
    import { T, useThrelte } from '@threlte/core'
    import { gsap } from 'gsap'
    import appState from '$lib/appState.svelte'
    import { onNavigate } from '$app/navigation'

    const { invalidate, size } = useThrelte()
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

    /** @param {import("three").OrthographicCamera} ref */
    const oncreate = (ref) => {
        ref.lookAt(0, 0, 0)

        const upAmount = 0.7
        // "center" the text, and move it upwards slightly (in viewport space)
        ref.position
            .add({ x: 0.5, y: 0, z: -0.5 })
            .add({ x: upAmount, y: 0, z: upAmount })

        updater = () => ref.updateProjectionMatrix()

        const startDir = ref.quaternion.clone()

        const forwards = new THREE.Vector3(0, 0, -1)
        const down = new THREE.Vector3(0, -1, 0)

        const endDir = new THREE.Quaternion()
        endDir.setFromUnitVectors(forwards, down)

        const endSpherical = new THREE.Spherical()
        endSpherical.setFromCartesianCoords(1, distance, 0)

        const spherical = new THREE.Spherical()
        spherical.setFromVector3(ref.position)

        const t = { value: 0 }

        const timeline = gsap.timeline({
            defaults: { duration: 1 },
            onUpdate: () => {
                ref.position.setFromSpherical(spherical)
                ref.quaternion.slerpQuaternions(startDir, endDir, t.value)
            },
        })

        timeline.to(spherical, endSpherical)
        timeline.to(t, { value: 1 }, '-=100%')

        $effect(() => {
            if (appState.contentIntersecting) {
                timeline.play()
            } else {
                timeline.reverse()
            }
        })
    }
</script>

<T.OrthographicCamera
    makeDefault
    manual
    left={-width / 2}
    right={width / 2}
    top={height / 2}
    bottom={-height / 2}
    position={distance}
    {oncreate}
/>
