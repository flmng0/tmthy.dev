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

        let start: DOMHighResTimeStamp

        const tick = (t: DOMHighResTimeStamp) => {
            sketch.draw(ctx, t - start)
            lastRequest = requestAnimationFrame(tick)
        }

        sketch.draw(ctx, 0)
        lastRequest = requestAnimationFrame((t) => {
            start = t
            tick(t)
        })
    })

    onCleanup(() => cancelAnimationFrame(lastRequest))

    return (
        <header class="relative flex aspect-square w-full flex-col gap-y-4 self-start border shadow-sm outline-1 outline-sky-200 transition-shadow focus-within:shadow-lg focus-within:outline lg:sticky lg:top-24">
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
