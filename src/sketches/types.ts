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

export type ControlType = keyof ControlTypeRegistry

export type ControlOptions<CType extends ControlType = ControlType> =
    ControlTypeRegistry[CType]['options']

export type ControlValueType<CType extends ControlType = ControlType> =
    ControlTypeRegistry[CType]['valueType']

export interface ControlConfig<CType extends ControlType = ControlType> {
    readonly type: CType
    name: string
    onUpdate: (value: ControlValueType<CType>) => void
    options?: Partial<ControlOptions<CType>>
}

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
