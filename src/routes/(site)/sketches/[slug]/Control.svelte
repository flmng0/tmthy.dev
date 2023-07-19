<script lang="ts">
    import type { ControlConfig } from '$lib/sketch'
    import { writable } from 'svelte/store'

    export let state: any | undefined
    export let config: ControlConfig

    const value = writable<any>(config.type === 'toggle' ? false : 0)

    //@ts-ignore
    $: state && config.onUpdate(state, $value)

    const inputClasses = 'self-end'

    const getInputType = () => {
        switch (config.type) {
            case 'range':
                return 'range'
            default:
                return 'checkbox'
        }
    }
    const inputType = getInputType()
</script>

<label class="flex w-full cursor-pointer flex-row justify-between gap-6">
    <span class="whitespace-nowrap">{config.name}</span>
    {#if config.type === 'toggle'}
        <input class={inputClasses} type="checkbox" bind:checked={$value} />
    {:else}
        <input
            class={inputClasses}
            type={inputType}
            value={$value}
            on:input={(e) => value.set(e.currentTarget.valueAsNumber)}
        />
    {/if}
</label>
