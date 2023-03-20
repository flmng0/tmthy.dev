import type { Sketch } from '@sketches/types'
import { onCleanup, onMount } from 'solid-js'

export default function SketchCanvas(props: { slug: string }) {
    let canvas: HTMLCanvasElement
    let lastRequest: number

    onMount(async () => {
        const mod = await import(`../sketches/${props.slug}.ts`)
        const sketch = mod.default as Sketch

        const ctx = canvas.getContext(sketch.type)! as any

        if (sketch.init !== undefined) {
            sketch.init(ctx)
        }

        const tick = (t: DOMHighResTimeStamp) => {
            sketch.draw(ctx, t)
            lastRequest = requestAnimationFrame(tick)
        }

        lastRequest = requestAnimationFrame(tick)
    })

    onCleanup(() => cancelAnimationFrame(lastRequest))

    return <canvas ref={canvas!} width="600" height="600" tabindex="0" />
}
