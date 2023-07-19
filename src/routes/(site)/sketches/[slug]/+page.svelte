<script lang="ts">
    import Canvas from './Canvas.svelte'
    import type { PageData } from './$types'
    import 'katex/dist/katex.min.css'
    import { onMount } from 'svelte'

    export let data: PageData

    const sketch = data.sketch
    let sourceCodeDialog: HTMLDialogElement

    const closeSourceCode = () => {
        sourceCodeDialog.close()
    }

    const showSourceCode = () => {
        sourceCodeDialog.showModal()
        document.body.style.overflow = 'hidden'
    }

    onMount(() => {
        sourceCodeDialog.addEventListener('close', () => {
            document.body.style.overflow = 'auto'
        })
    })
</script>

<svelte:head>
    <title>{sketch.properties.name} | Sketches</title>
</svelte:head>

<dialog
    bind:this={sourceCodeDialog}
    class="source-code z-10 overflow-auto p-0 backdrop:bg-flamingo-950/25"
>
    <div class="fixed inset-0 -z-10" on:pointerup={() => closeSourceCode()} />
    <button
        class="fixed right-4 top-4 z-20 grid aspect-square w-12 place-items-center bg-flamingo-800 text-white"
        on:click={() => closeSourceCode()}
    >
        <iconify-icon icon="mdi:close" />
    </button>
    <article class="min-w-max px-4 py-3" style:background-color={data.sourceCodeBackground}>
        {@html data.sourceCode}
    </article>
</dialog>

<article class="mx-auto my-8 grid w-fit grid-cols-1 gap-x-8 gap-y-8 px-6 lg:grid-cols-2">
    <header class="flex flex-col self-start lg:sticky lg:top-24">
        <Canvas sketch={data.module} />
        <button class="bg-flamingo-800 px-6 py-4 text-white" on:click={() => showSourceCode()}
            >Show Source Code</button
        >
    </header>

    <main class="space-y-6">
        <nav class="card prose px-6 py-8">
            <h3>Contents</h3>
            <ul class="list-disc">
                {#each sketch.toc as h}
                    <li class="toc" style:--depth={h.depth - 2}>
                        <a href="#{h.id}">{h.value}</a>
                    </li>
                {/each}
            </ul>
        </nav>

        <div class="prose">
            <hgroup>
                <h1>{sketch.properties.name}</h1>
                <p>{sketch.properties.brief}</p>
            </hgroup>

            {@html sketch.body}
        </div>
    </main>
</article>

<style lang="postcss">
    article :global(.card) {
        @apply self-start bg-flamingo-950 shadow-sm;
    }

    li.toc {
        margin-left: calc(1.25em * var(--depth));
    }
</style>
