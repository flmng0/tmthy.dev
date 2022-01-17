export type State = {
	t: number;
	dt: number;
	ctx: CanvasRenderingContext2D;
	cvs: HTMLCanvasElement;
};

export type DrawCallback = (state: State) => undefined;
export type InitCallback = (state: State) => undefined;

export interface Sketch {
	init?: InitCallback;
	draw: DrawCallback;
}
