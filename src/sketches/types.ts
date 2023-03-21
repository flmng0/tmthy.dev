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

export interface ControlCommon<ValueType, OptionsType> {
    name: string
    // TODO: Add this?
    // default: ValueType,
    onUpdate: (value: ValueType) => void
    options?: Partial<OptionsType>
}

export type ControlType = keyof ControlTypeRegistry

// It's simplified but I still think it could be simpler...
export type ControlConfig<CType extends ControlType = ControlType> = {
    [key in ControlType]: { type: key } & ControlCommon<
        ControlTypeRegistry[key]['valueType'],
        ControlTypeRegistry[key]['options']
    >
}[CType]

export interface ContextTypeMap {
    '2d': CanvasRenderingContext2D
    webgl2: WebGL2RenderingContext
}

export type ContextType = keyof ContextTypeMap

export type Context<XType extends ContextType = ContextType> = ContextTypeMap[XType]

interface SketchCommon<XType extends ContextType> {
    init(canvas: Context<XType>): void
    draw(ctx: Context<XType>, t: number): void
    controls?: ControlConfig[]
}

interface SketchWebGL2 extends SketchCommon<'webgl2'> {
    readonly type: 'webgl2'
}

interface Sketch2D extends SketchCommon<'2d'> {
    readonly type: '2d'
}

export type Sketch = SketchWebGL2 | Sketch2D
