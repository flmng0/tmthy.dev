import type { ControlConfig, ControlType, ControlValue } from '@sketches/types'
import { createEffect, createSignal, Match, Switch } from 'solid-js'

export default function SketchControl<CType extends ControlType = ControlType>(props: {
    config: ControlConfig<CType>
}) {
    const { config } = props

    const [value, setValue] = createSignal<ControlValue<CType>>(
        config.type === 'toggle' ? false : 0
    )
    createEffect(() => {
        config.onUpdate(value())
    })

    const type = () => {
        switch (config.type) {
            case 'range':
                return 'range'
            case 'toggle':
                return 'checkbox'
        }
    }

    const inputClasses = 'self-end'

    return (
        <label class="flex w-full cursor-pointer flex-row justify-between gap-6">
            <span class="whitespace-nowrap">{config.name}</span>
            <Switch
                fallback={
                    <input
                        class={inputClasses}
                        {...config.options}
                        type={type()}
                        value={value() as number}
                        onInput={(e) => setValue(e.currentTarget.valueAsNumber)}
                    />
                }
            >
                <Match when={type() === 'checkbox'}>
                    <input
                        class={inputClasses}
                        type="checkbox"
                        checked={value() as boolean}
                        onChange={(e) => setValue(e.currentTarget.checked)}
                    />
                </Match>
            </Switch>
        </label>
    )
}
