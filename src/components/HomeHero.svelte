<script lang="ts">
    import { Canvas } from '@threlte/core'
    import * as THREE from 'three'

    import Scene from '../lib/home/Scene.svelte'
    import Drawer from '../lib/Drawer.svelte'

    let ready = $state(false)
    let far = $state(false)
    let root = $state<HTMLElement>()

    let goHome = $state<(e: MouseEvent) => void>()
</script>

<main class:ready bind:this={root}>
    <Canvas toneMapping={THREE.NeutralToneMapping}>
        <Scene
            onready={() => (ready = true)}
            onfar={(f) => (far = f)}
            bind:goHome
        />
    </Canvas>
</main>

<Drawer />
<button class="home" class:far onclick={goHome}>Go Home!</button>

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

    .home {
        background: black;
        color: white;
        position: fixed;
        cursor: pointer;
        top: 0;
        right: 0;
        margin: 1em;
        padding: 0.4em 0.6em;
        font-size: 1.25rem;
        border: unset;
        --shadow: 4px;
        box-shadow: var(--shadow) var(--shadow) 0 0 #888888;
        transition: opacity 700ms cubic-bezier(0.075, 0.82, 0.165, 1);
        pointer-events: none;
        opacity: 0;
    }

    .home:hover {
        background: white;
        color: black;
    }
    .home:active {
        translate: 2px 2px;
        --shadow: 1px;
    }

    .home.far {
        pointer-events: initial;
        opacity: 1;
    }
</style>
