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

        canvas.addEventListener("mousemove", (e) => {
          const pos = computePointPos(e.offsetX, e.offsetY, canvas);
          app.ports.mouseMove.send(pos);
        });

        window.requestAnimationFrame(tick);
      });
    },

    async source(sourceId: string) {
      return (await import(`./elm/${sourceId}.elm?raw`)).default;
    },

    lang: "elm",
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
