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

    // <div class="border shadow-sm outline-1 outline-sky-200 transition-shadow focus-within:shadow-lg focus-within:outline">
    // </div>
    return (
        <header class="relative flex aspect-square w-full flex-col gap-y-4 self-start border shadow-sm outline-1 outline-sky-200 transition-shadow focus-within:shadow-lg focus-within:outline xl:sticky xl:top-24">
            <canvas ref={canvas!} width="600" height="600" tabindex="0" class="h-full w-full" />

            <Show when={controls()?.length}>
                <details class="card absolute top-0 right-0 space-y-4 px-5 py-3">
                    <summary class="cursor-pointer text-lg font-medium">Settings</summary>
                    <ul class="space-y-4">
                        <For each={controls()!}>
                            {(config) => (
                                <li class="px-4">
                                    <SketchControl config={config} />
                                </li>
                            )}
                        </For>
                    </ul>
                </details>
            </Show>
        </header>
    )
}
