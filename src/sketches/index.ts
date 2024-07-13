import type { CollectionEntry } from "astro:content";

export type SketchEntry = CollectionEntry<"sketches">;

export type SketchHandler = {
  run(sourceId: string, canvas: HTMLCanvasElement): Promise<void>;
  source(sourceId: string): Promise<string>;
  lang: string;
};

function computePointPos(
  x: number,
  y: number,
  canvas: HTMLCanvasElement,
): [number, number] {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return [x * scaleX, y * scaleY];
}

export const handlers: Record<string, SketchHandler> = {
  elm: {
    async run(sourceId: string, canvas: HTMLCanvasElement) {
      const ctx = canvas.getContext("2d")!;

      const { Elm } = await import(`./elm/${sourceId}.elm`);

      type DrawCmdType = "line" | "rect" | "circle" | "polygon";
      type DrawCmd = {
        strokeWidth: number;
        strokeColor: string;
        fillColor: string;
        shape: { type: DrawCmdType; arguments: number[] };
      };

      const drawers: Record<DrawCmdType, (args: number[]) => void> = {
        line([x1, y1, x2, y2]) {
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        },

        rect([x, y, w, h]) {
          ctx.rect(x, y, w, h);
        },

        circle([x, y, r]) {
          ctx.arc(x, y, r, 0, 2 * Math.PI);
        },

        polygon(points) {
          for (let i = 0; i < points.length / 2; i++) {
            const x = points[i * 2 + 0];
            const y = points[i * 2 + 1];

            if (i == 0) {
              ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
          }
        },
      };

      function draw(cmd: DrawCmd) {
        ctx.save();

        ctx.lineWidth = cmd.strokeWidth;
        ctx.strokeStyle = cmd.strokeColor;
        ctx.fillStyle = cmd.fillColor;

        ctx.beginPath();

        const drawer = drawers[cmd.shape.type];
        drawer(cmd.shape.arguments);

        if (ctx.lineWidth > 0.0) {
          ctx.stroke();
        }

        ctx.fill();

        ctx.restore();
      }

      let app: any;

      function tick(t: number) {
        app.ports.tick.send(t / 1000);

        window.requestAnimationFrame(tick);
      }

      window.requestAnimationFrame((t) => {
        app = Elm[sourceId].init({ flags: t / 1000 });

        app.ports.submitFrame.subscribe((cmds: DrawCmd[]) => {
          for (const cmd of cmds) {
            draw(cmd);
          }
        });

        const sendMouseMove = ({ offsetX, offsetY }: MouseEvent) => {
          const pos = computePointPos(offsetX, offsetY, canvas);
          app.ports.mouseMove.send(pos);
        };

        canvas.addEventListener("pointermove", sendMouseMove);
        canvas.addEventListener("pointerdown", sendMouseMove);

        window.requestAnimationFrame(tick);
      });
    },

    async source(sourceId: string) {
      return (await import(`./elm/${sourceId}.elm?raw`)).default;
    },

    lang: "elm",
  },

  shader: {
    async run(sourceId: string, canvas: HTMLCanvasElement) {
      const vertSource = `#version 300 es
in vec2 position;

void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

      const fragHeader = `#version 300 es
precision highp float;
uniform float u_Time;
uniform vec2 u_Res;
`;
      const fragBody = (await import(`./shader/${sourceId}.glsl?raw`)).default;
      const fragSource = fragHeader + fragBody;

      const gl = canvas.getContext("webgl2")!;

      const makeShader = (type: number, source: string) => {
        const shader = gl.createShader(type)!;

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          return shader;
        }

        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw `Failed to compile WebGL program.\n\n${info}`;
      };

      const vert = makeShader(gl.VERTEX_SHADER, vertSource);
      const frag = makeShader(gl.FRAGMENT_SHADER, fragSource);

      const prog = gl.createProgram()!;
      gl.attachShader(prog, vert);
      gl.attachShader(prog, frag);
      gl.linkProgram(prog);

      const posLoc = gl.getAttribLocation(prog, "position");

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);

      // prettier-ignore
      const bufData = new Float32Array([
        -1.0, -1.0, 
         1.0, -1.0, 
        -1.0,  1.0, 
        -1.0,  1.0, 
         1.0,  1.0, 
         1.0, -1.0,
      ]);

      gl.bufferData(gl.ARRAY_BUFFER, bufData, gl.STATIC_DRAW);

      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.useProgram(prog);
      gl.bindVertexArray(vao);
      gl.clearColor(0, 0, 0, 1);

      const tLoc = gl.getUniformLocation(prog, "u_Time")!;
      const resLoc = gl.getUniformLocation(prog, "u_Res")!;

      gl.uniform2f(resLoc, canvas.width, canvas.height);

      let firstT;

      function tick(now: number) {
        const t = (now - firstT) / 1000;

        gl.uniform1f(tLoc, t);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        window.requestAnimationFrame(tick);
      }

      window.requestAnimationFrame((t) => {
        firstT = t;
        tick(t);
      });
    },

    async source(sourceId: string) {
      return (await import(`./shader/${sourceId}.glsl?raw`)).default;
    },

    lang: "glsl",
  },
};

export async function runSketch(
  sketch: SketchEntry,
  canvas: HTMLCanvasElement,
) {
  const { run } = handlers[sketch.data.type];

  await run(sketch.data.sourceId, canvas);
}

export async function getSketchSource(
  sketch: SketchEntry,
): Promise<{ code: string; lang: string }> {
  const { source, lang } = handlers[sketch.data.type];

  const code = await source(sketch.data.sourceId);

  return {
    code,
    lang,
  };
}
