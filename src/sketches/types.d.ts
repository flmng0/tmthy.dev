export interface DrawFunction {
    (ctx: CanvasRenderingContext2D, t: DOMHighResTimeStamp): void
}
export interface InitFunction {
    (canvas: HTMLCanvasElement): void
}
