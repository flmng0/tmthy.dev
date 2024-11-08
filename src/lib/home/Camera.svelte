<script lang="ts">
    import { T, useThrelte } from '@threlte/core'

    const azimuth = Math.PI / 4
    const altitude = Math.PI / 2 - Math.atan(Math.SQRT1_2)

    const distance = 100

    const { size } = useThrelte()
    const scale = 80

    let zoom = $derived(($size.width / 1028) * scale)
</script>

<T.OrthographicCamera
    {zoom}
    makeDefault
    oncreate={(ref) => {
        ref.position.setFromSphericalCoords(distance, altitude, azimuth)
        ref.lookAt(0, 0, 0)
    }}
/>
