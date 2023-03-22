import type { ControlConfig, Sketch } from '@sketches/types'
import { createSignal, For, onCleanup, onMount, Show } from 'solid-js'
import SketchControl from './SketchControl'

// TODO: Implement pause and resume functionality.
//       Maybe pause on blur?

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
        <header class="flex flex-col gap-y-4">
            <div class="w-min border shadow-sm outline-1 outline-sky-200 transition-shadow focus-within:shadow-lg focus-within:outline">
                <canvas ref={canvas!} width="600" height="600" tabindex="0" />
            </div>
            <Show when={controls()?.length}>
                <ul class="card min-w-32 flex w-full flex-col gap-4">
                    <h3 class="text-xl font-medium">Sketch Settings</h3>
                    <For each={controls()!}>
                        {(config) => (
                            <li class="px-4">
                                <SketchControl config={config} />
                            </li>
                        )}
                    </For>
                </ul>
            </Show>
        </header>
    )
}
