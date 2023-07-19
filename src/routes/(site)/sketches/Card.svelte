<script lang="ts">
    import type { CollectionData } from '$lib/server/data'

    export let sketch: CollectionData<'sketches'>

    const { name, brief } = sketch.properties
</script>

<article
    class="rounded-md border border-flamingo-800 bg-flamingo-900 px-6 py-4 text-flamingo-100 shadow-lg ring-flamingo-800 hover:ring"
>
    <hgroup>
        <h2 class="mb-3 text-xl">{name}</h2>
        <p class="font-light italic text-flamingo-50">
            {brief}
        </p>
    </hgroup>
</article>
