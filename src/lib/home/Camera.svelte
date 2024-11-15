<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import * as THREE from 'three'
    import IsometricMapControls from './IsometricMapControls'
    import { useHomeContext } from './context'

    interface Props {
        ref?: THREE.OrthographicCamera
    }
    let { ref = $bindable() }: Props = $props()

    const { controlsEnabled, controller, isFar } = useHomeContext()

    const azimuth = Math.PI / 4
    const altitude = Math.PI / 2 - Math.atan(Math.SQRT1_2)

    const farDist = 10
    const farDistSq = farDist * farDist
    const distance = 100

    const { size } = useThrelte()
    const scale = 80

    let zoom = $derived(($size.width / 1028) * scale)

    let { renderer, invalidate } = useThrelte()
    let floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.5)

    let controls: IsometricMapControls | undefined = $state(undefined)

    $effect(() => {
        if (controls) {
            controls.enabled = $controlsEnabled
            controller.set(controls)
        }
    })

    const enableControls = (ref: THREE.OrthographicCamera) => {
        controls = new IsometricMapControls(
            ref,
            renderer.domElement,
            floorPlane
        )

        controls.addEventListener('change', () => {
            invalidate()

            $isFar = controls!.getDistSquared() >= farDistSq
        })
    }
</script>

<T.OrthographicCamera
    {zoom}
    makeDefault
    oncreate={(ref) => {
        ref.position.setFromSphericalCoords(distance, altitude, azimuth)
        ref.lookAt(0, 0, 0)

        // Has to be done here instead of normal because controller relies
        // on the position and direction of the camera.
        enableControls(ref)
    }}
    bind:ref
/>
