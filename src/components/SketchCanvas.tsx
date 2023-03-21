import type { ControlConfig, Sketch } from '@sketches/types'
import { createSignal, For, onCleanup, onMount } from 'solid-js'
import SketchControl from './SketchControl'

export default function SketchCanvas(props: { slug: string }) {
    let canvas: HTMLCanvasElement
    let lastRequest: number

    const [controls, setControls] = createSignal<ControlConfig[]>()

    onMount(async () => {
        const mod = await import(`../sketches/${props.slug}.ts`)
        const sketch = mod.default as Sketch

        const ctx = canvas.getContext(sketch.type)! as any

        if (sketch.init !== undefined) {
            sketch.init(ctx)
        }

        if (sketch.controls !== undefined) {
            setControls(sketch.controls)
        }

        const tick = (t: DOMHighResTimeStamp) => {
            sketch.draw(ctx, t)
            lastRequest = requestAnimationFrame(tick)
        }

        lastRequest = requestAnimationFrame(tick)
    })

    onCleanup(() => cancelAnimationFrame(lastRequest))

    return (
        <>
            <div class="w-min border shadow-sm outline-1 outline-sky-200 transition-shadow focus-within:shadow-lg focus-within:outline">
                <canvas ref={canvas!} width="600" height="600" tabindex="0" />
            </div>
            <ul
                class="card min-w-32 flex w-full flex-col gap-4"
                classList={{ invisible: controls() === undefined || controls()!.length === 0 }}
            >
                <h3 class="text-xl font-medium">Sketch Settings</h3>
                <For each={controls()!}>
                    {(config) => (
                        <li class="px-4">
                            <SketchControl config={config} />
                        </li>
                    )}
                </For>
            </ul>
        </>
    )
}