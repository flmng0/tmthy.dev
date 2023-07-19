<script lang="ts">
    import { onMount } from 'svelte'
    import Control from './Control.svelte'
    import type { Sketch } from '$lib/sketch'

    export let sketch: Sketch

    let canvas: HTMLCanvasElement

    let state: any = undefined
    let controls = sketch.controls

    onMount(() => {
        state = sketch.init(canvas)

        let start: number
        let lastAnimationID: number

        const tick = (t: number) => {
            sketch.draw(state, t - start)
            lastAnimationID = requestAnimationFrame(tick)
        }

        lastAnimationID = requestAnimationFrame((t) => {
            start = t
            tick(t)
        })

        return () => {
            cancelAnimationFrame(lastAnimationID)
        }
    })
</script>

<div
    class="relative flex aspect-square w-full flex-col gap-y-4 shadow-sm outline-2 outline-flamingo-300 transition-shadow focus-within:shadow-lg focus-within:outline"
>
    <canvas width="600" height="600" tabindex="0" class="h-full w-full" bind:this={canvas} />

    {#if controls && state}
        <details
            class="card absolute right-0 top-0 space-y-4 !border-r-[0] !border-t-[0] px-5 py-3"
        >
            <summary class="cursor-pointer text-lg font-medium">Settings</summary>
            <ul class="space-y-4">
                {#each controls as config}
                    <li class="px-4">
                        <Control {state} {config} />
                    </li>
                {/each}
            </ul>
        </details>
    {/if}
</div>
