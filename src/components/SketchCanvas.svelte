<script lang="ts">
    import { onMount } from 'svelte'

    export let slug: string

    let canvas: HTMLCanvasElement

    onMount(async () => {
        const sketch = await import(`../sketches/${slug}.ts`)

        if (sketch.init !== undefined) {
            sketch.init(canvas)
        }

        const ctxType = sketch.ctxType ?? '2d'
        const ctx = canvas.getContext(ctxType)

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
