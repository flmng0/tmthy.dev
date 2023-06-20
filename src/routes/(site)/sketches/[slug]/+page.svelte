<script lang="ts">
    import Canvas from './Canvas.svelte'
    import type { PageData } from './$types'
    import 'katex/dist/katex.min.css'

    export let data: PageData

    const sketch = data.sketch
</script>

<svelte:head>
    <title>{sketch.properties.name} | Sketches</title>
</svelte:head>

<article class="mx-auto my-8 grid w-fit grid-cols-1 gap-x-8 gap-y-8 px-6 lg:grid-cols-2">
    <Canvas sketch={data.module} />

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
