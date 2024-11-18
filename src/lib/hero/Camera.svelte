<script>
    import * as THREE from 'three'
    import { T, useThrelte } from '@threlte/core'
    import { gsap } from 'gsap'
    import appState from '$lib/appState.svelte'

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

        const finalEndPosition = new THREE.Vector3()
        finalEndPosition.setFromSpherical(endSpherical)
        finalEndPosition.add({ x: 0, y: 0, z: 2 })

        const spherical = new THREE.Spherical()
        spherical.setFromVector3(ref.position)

        const t = { value: 0 }

        const timeline = gsap.timeline({
            defaults: { duration: 1 },
            onUpdate: () => {
                invalidate()
            },
        })

        timeline.to(spherical, {
            ...endSpherical,
            onUpdate: () => {
                ref.position.setFromSpherical(spherical)
            },
        })
        timeline.to(
            t,
            {
                value: 1,
                onUpdate: () => {
                    ref.quaternion.slerpQuaternions(startDir, endDir, t.value)
                },
            },
            '-=100%'
        )

        timeline.to(ref.position, {
            z: finalEndPosition.z,
            duration: 0.5,
            ease: 'sine.inOut',
        })

        $effect(() => {
            if (appState.contentIntersecting) {
                timeline.timeScale(1)
                timeline.play()
            } else {
                timeline.timeScale(2)
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
