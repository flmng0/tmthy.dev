<script>
    import { Canvas } from '@threlte/core'
    import Scene from './Scene.svelte'
    import { NeutralToneMapping } from 'three'
    import appState from '$lib/appState.svelte'

    /** @type {{ title: string }} */
    let { title } = $props()
</script>

<div class:ready={appState.ready}>
    <Canvas toneMapping={NeutralToneMapping}>
        <Scene {title} />
    </Canvas>
</div>

<style>
    div {
        position: fixed;
        inset: 0;
        opacity: 0;
        height: 100%;

        transition: opacity 400ms ease-in;
    }
    div.ready {
        opacity: 1;
    }
</style>
