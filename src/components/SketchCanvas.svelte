<script lang="ts">
    import type { ControlConfig, Sketch } from '@sketches/types'
    import { onMount } from 'svelte'
    import SketchControls from './SketchControls.svelte'

    export let slug: string

    let canvas: HTMLCanvasElement
    let controls: ControlConfig[]

    onMount(async () => {
        const mod = await import(`../sketches/${slug}.ts`)
        const sketch = mod.default as Sketch

        const ctx = canvas.getContext(sketch.type)! as any

        if (sketch.controls !== undefined) {
            controls = sketch.controls
        }

        if (sketch.init !== undefined) {
            sketch.init(ctx)
        }

        let lastRequest: number
        const tick = (t: DOMHighResTimeStamp) => {
            sketch.draw(ctx, t)
            lastRequest = requestAnimationFrame(tick)
        }

        lastRequest = requestAnimationFrame(tick)

        return () => cancelAnimationFrame(lastRequest)
    })
</script>

<canvas width="600" height="600" tabindex="0" bind:this={canvas} />
{#if controls}
    <SketchControls {controls} />
{/if}
