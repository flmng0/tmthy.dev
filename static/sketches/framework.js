/**
 * @typedef {Object} State
 *
 * @property {number} t - The current time in seconds since the start of the sketch.
 * @property {number} dt - The time in seconds since the last frame.
 * @property {CanvasRenderingContext2D} ctx - 2D rendering context of the canvas.
 * @property {HTMLCanvasElement} cvs - The sketch canvas.
 */

/**
 * Draw-loop callback method for running a sketch.
 *
 * @callback DrawCallback
 *
 * @param {State} state - The current state of the sketch.
 *
 * @returns {undefined}
 */

/**
 * Callback called once, before the sketch is run.
 *
 * @callback InitCallback
 *
 * @param {State} state - The current state of the sketch.
 *
 * @returns {undefined}
 */

/**
 * @typedef {Object} RunOptions
 *
 * @property {InitCallback} init - Callback to call before the start of a sketch.
 * @property {HTMLCanvasElement} cvs - Canvas to use instead of #sketch-canvas.
 */

/**
 * Run a sketch, given a draw callback.
 *
 * @param {DrawCallback} drawFn - Draw callback run every tick of the gameloop
 * @param {RunOptions} options - Options for the sketch.
 *
 * @return {undefined}
 */
export function run(drawFn, options) {
	const state = {
		t: null,
		dt: null,
		ctx: null,
		cvs: null,
	}

	const tick = (t) => {
        const ts = t / 1000
		state.dt = (ts - state.t)
		state.t = ts

		drawFn(state)

		window.requestAnimationFrame(tick)
	}

	window.requestAnimationFrame((t) => {
        const {init, cvs} = options;

		state.t = t
        state.dt = 0

		if (cvs) {
			state.cvs = cvs
		} else {
			state.cvs = document.querySelector('#sketch-canvas')

            if (state.cvs == null) {
                console.error("`#sketch-canvas` not found");
                return;
            }
		}

		state.ctx = state.cvs.getContext('2d')

        if (init) {
            init(state);
        }

		window.requestAnimationFrame(tick)
	})
}
