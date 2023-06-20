export interface SketchModule {
    default: Sketch
}

export function importSketch(slug: string): Promise<SketchModule> {
    return import(`./sketches/${slug}.ts`)
}

export interface Sketch<T = any> {
    init(canvas: HTMLCanvasElement): T | null
    draw(state: T, t: number): void
    controls?: ControlConfig<T>[]
}

export interface ControlTypeRegistry {
    range: {
        valueType: number
        options: {
            min: number
            max: number
            step: number
            value: number
        }
    }
    toggle: {
        valueType: boolean
        options: null
    }
}

export type ControlValue<CType extends ControlType> = ControlTypeRegistry[CType]['valueType']
export type ControlOptions<CType extends ControlType> = ControlTypeRegistry[CType]['options']

export interface ControlCommon<T, CType extends ControlType> {
    name: string
    // TODO: Add this?
    // default: ValueType,
    onUpdate: (state: T, value: ControlValue<CType>) => void
    options?: Partial<ControlOptions<CType>>
}

export type ControlType = keyof ControlTypeRegistry

// It's simplified but I still think it could be simpler...
export type ControlConfig<T = any, CType extends ControlType = ControlType> = {
    [key in ControlType]: { type: key } & ControlCommon<T, key>
}[CType]
