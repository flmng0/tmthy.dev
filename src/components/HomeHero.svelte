<script lang="ts">
    import { Canvas } from '@threlte/core'
    import Scene from '../lib/home/Scene.svelte'

    let ready = $state(false)
</script>

<main class:ready>
    <Canvas>
        <Scene onready={() => (ready = true)} />
    </Canvas>
</main>

<style>
    main {
        position: absolute;
        inset: 0;

        opacity: 0;
        transition: opacity 700ms ease-in;
    }

    main.ready {
        opacity: 1;
    }
</style>
