const ITERATIONS = 400;
const R = 2;

let c;

const vertSource = `#version 300 es
in vec2 position;

void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragSource = `#version 300 es
precision highp float;

uniform vec2 u_c;
uniform vec2 u_s;
out vec4 outColor;

void main() {
    vec2 z = float(${R}) * (2.0 * (gl_FragCoord.xy / u_s) - vec2(1.0));

    int i = 0;

    while (length(z) < float(${R}) && i < ${ITERATIONS}) {
        float x = z.x * z.x - z.y * z.y;
        float y = 2.0 * z.x * z.y;

        z = vec2(x, y) + u_c;

        i = i + 1;
    }

    if (i == ${ITERATIONS}) i = 0;

    float j = float(i) / float(${ITERATIONS});

    outColor = vec4(vec3(j), 1.0);
}
`;

const mag = 0.7885;

function makeShader(gl, type, src) {
	const shader = gl.createShader(type);

	gl.shaderSource(shader, src);
	gl.compileShader(shader);

	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		return shader;
	}

	const info = gl.getShaderInfoLog(shader);
	gl.deleteShader(shader);
	throw `Failed to compile WebGL program.\n\n${info}`;
}

let c_loc;
let s_loc;

let frame = 0;

/** @type {import("$lib/sketch").Sketch} */
const sketch = {
	init(canvas) {
		const gl = canvas.getContext('webgl2');

		c = { x: 0, y: 0 };

		const frag = makeShader(gl, gl.FRAGMENT_SHADER, fragSource);
		const vert = makeShader(gl, gl.VERTEX_SHADER, vertSource);

		const prg = gl.createProgram();
		gl.attachShader(prg, vert);
		gl.attachShader(prg, frag);
		gl.linkProgram(prg);

		const positionLoc = gl.getAttribLocation(prg, 'position');

		const posBuf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);

		// prettier-ignore
		const positions = [
            -1.0, -1.0, 
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0,  1.0,
             1.0, -1.0,
        ]
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		const vao = gl.createVertexArray();
		gl.bindVertexArray(vao);

		gl.enableVertexAttribArray(positionLoc);

		gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		gl.useProgram(prg);
		gl.bindVertexArray(vao);

		c_loc = gl.getUniformLocation(prg, 'u_c');
		s_loc = gl.getUniformLocation(prg, 'u_s');

		gl.clearColor(0, 0, 0, 0);

		return gl;
	},

	draw(gl, t) {
		// Skip every second frame (performance kinda)
		if (frame++ % 2 == 0) {
			return;
		}

		const theta = (t / 2000) % (Math.PI * 2);

		c.x = Math.cos(theta) * mag;
		c.y = Math.sin(theta) * mag;

		gl.uniform2f(c_loc, c.x, c.y);
		gl.uniform2f(s_loc, gl.canvas.width, gl.canvas.height);

		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
};

export default sketch;
