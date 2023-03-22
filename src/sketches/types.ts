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

export interface ControlCommon<CType extends ControlType> {
    name: string
    // TODO: Add this?
    // default: ValueType,
    onUpdate: (value: ControlValue<CType>) => void
    options?: Partial<ControlOptions<CType>>
}

export type ControlType = keyof ControlTypeRegistry

// It's simplified but I still think it could be simpler...
export type ControlConfig<CType extends ControlType = ControlType> = {
    [key in ControlType]: { type: key } & ControlCommon<key>
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
