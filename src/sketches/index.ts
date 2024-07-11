import type { CollectionEntry } from "astro:content";

export type SketchEntry = CollectionEntry<"sketches">;

export type SketchHandler = {
  run(canvas: HTMLCanvasElement): Promise<void>;
  source(): Promise<string>;
};

export const runners: Record<string, (sourceId: string) => SketchHandler> = {
  elm(sourceId: string) {
    const run = async (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d")!;

      const { Elm } = await import(`./elm/${sourceId}.elm`);

      type DrawCmdType = "line" | "rect" | "circle";
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

      let firstT: number;

      function tick(now: number) {
        const t = now - firstT;

        app.ports.tick.send(t);

        window.requestAnimationFrame(tick);
      }

      window.requestAnimationFrame((t) => {
        firstT = t;

        app = Elm[sourceId].init({ flags: t });

        app.ports.submitFrame.subscribe((cmds: DrawCmd[]) => {
          for (const cmd of cmds) {
            draw(cmd);
          }
        });

        canvas.addEventListener("mousemove", (e) => {
          app.ports.mouseMove.send([e.offsetX, e.offsetY]);
        });

        tick(t);
      });
    };

    const source = () =>
      import(`./elm/${sourceId}.elm?raw`).then((r) => r.default);

    return { run, source };
  },

  // shader(entry: SketchEntry, canvas: HTMLCanvasElement) {},
};

export async function runSketch(
  sketch: SketchEntry,
  canvas: HTMLCanvasElement,
) {
  const handler = runners[sketch.data.type];
  const { run } = handler(sketch.data.sourceId);

  await run(canvas);
}
