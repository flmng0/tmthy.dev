<script lang="ts">
    import type { PageData } from './$types'

    import Card from './Card.svelte'

    export let data: PageData
</script>

<svelte:head>
    <title>Sketches | tmthy.dev</title>
</svelte:head>

<main class="container mx-auto w-full max-w-screen-md space-y-4 px-5">
    <hgroup class="prose">
        <h1>Sketches</h1>
        <p>
            Collection of coding "sketches". These are un-refined projects made for experimentation
            and, most of the time, fun.
        </p>
    </hgroup>

    <ul class="flex flex-row flex-wrap gap-4">
        {#each data.sketches as sketch}
            <li class="flex-1 basis-56">
                <a href="/sketches/{sketch.slug}">
                    <Card {sketch} />
                </a>
            </li>
        {/each}
    </ul>
</main>
