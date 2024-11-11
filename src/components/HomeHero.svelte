<script lang="ts">
    import { Canvas } from '@threlte/core'
    import * as THREE from 'three'

    import Scene from '../lib/home/Scene.svelte'
    import Drawer, { closeDrawer } from '../lib/Drawer.svelte'

    let ready = $state(false)
    let root = $state<HTMLElement>()
</script>

<Drawer />

<main class:ready bind:this={root} onpointerdown={() => closeDrawer()}>
    <Canvas toneMapping={THREE.NeutralToneMapping}>
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

    main :global(canvas) {
        touch-action: none;
    }
</style>
