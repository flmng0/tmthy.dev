<script lang="ts">
    import type { ControlConfig, ControlType } from '@sketches/types'

    export let controls: ControlConfig[]

    const inputTypeMap: Record<ControlType, string> = {
        range: 'range',
        toggle: 'checkbox',
    }

    function onChange(control: ControlConfig) {
        return (e: Event) => {
            const target = e.target as HTMLInputElement

            let value
            switch (control.type) {
                case 'toggle':
                    value = target.checked
                    break
                case 'range':
                    value = target.valueAsNumber
                    break
            }

            control.onUpdate(value)
        }
    }
</script>

<ul>
    {#each controls as control}
        <li>
            <label>
                {control.name}
                <input
                    type={inputTypeMap[control.type]}
                    on:change={onChange(control)}
                    {...control.options}
                />
            </label>
        </li>
    {/each}
</ul>
