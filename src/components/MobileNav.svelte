<script lang="ts">
    export let pages: {
        href: string
        name: string
    }[]

    export let current: string

    const openMargin = 50

    let lastScroll: number
    let scrollY: number

    let hidden: boolean = false

    function checkHidden(scroll: number) {
        if (scrollY === undefined) return
        const dy = scroll - lastScroll

        hidden = scrollY > openMargin && dy >= 0
        lastScroll = scroll
    }

    $: checkHidden(scrollY)
</script>

<svelte:window bind:scrollY />

{#if !hidden}
    <nav class="relative flex h-12 items-center justify-start px-5">
        <ul class="links">
            {#each pages as { href, name }}
                <li aria-current={current === href}>
                    <a {href}>{name}</a>
                </li>
            {/each}
        </ul>
    </nav>
{/if}

<style lang="postcss">
    .links {
        @apply flex h-full items-center gap-4;
    }
</style>
