<script lang="ts">
  import { onMount } from "svelte";
  import type { Sketch } from "../sketches/common";

  export let appName: string;

  // Will be used for when loading in future.
  //export let background: string | null;

  let sketchRoot: HTMLDivElement;

  onMount(async () => {
    const { Elm } = await import(`../sketches/elm/${appName}.elm`);

    const app = Elm[appName].init({
      node: sketchRoot
    });

    let canvas, context;

    let firstT;

    function tick(t) {
      t /= 1000;
      if (firstT === undefined) {
        firstT = t;
      }

      app.ports.tick.send(t - firstT);
      requestAnimationFrame(tick);
    }

    app.ports.started.subscribe(
      (id) => {
        canvas = document.getElementById(id);
        context = canvas.getContext("2d");

        requestAnimationFrame(tick);
      }
    );

    function pathWrapper(draw) {
      context.beginPath();

      draw();

      context.fill();
      context.stroke();
    }

    const shapeHandlers = {
      rect(args) {
        context.fillRect(...args);

        if (context.strokeWidth > 0.0) {
          context.strokeRect(...args);
        }
      },

      line(args) {
        const [x1, y1, x2, y2] = args;

        pathWrapper(() => {
          context.moveTo(x1, y1);
          context.lineTo(x2, y2);
        })
      },

      circle(args) {
        const [x, y, r] = args;

        pathWrapper(() => {
          context.arc(x, y, r, 0, Math.PI * 2);
        })
      }
    }

    function applyCommand(cmd) {
      context.save();

      context.fillStyle = cmd.fillColor;
      context.strokeStyle = cmd.strokeColor;
      context.strokeWidth = cmd.strokeWidth;

      const handler = shapeHandlers[cmd.shape.type];
      handler(cmd.shape.arguments);

      context.restore();
    }

    app.ports.submitFrame.subscribe(
      (drawCommands) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCommands.forEach(applyCommand);
      }
    )
  });
</script>

<div id="sketchRoot" bind:this={sketchRoot}></div>

