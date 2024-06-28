<script lang="ts">
  import { onMount } from "svelte";
  import type { Sketch } from "../sketches/common";

  export let appName: string;
  export let background: string | null;

  let sketchRoot: HTMLDivElement;

  onMount(async () => {
    const { Elm } = await import(`../sketches/elm/${appName}.elm`);

    const app = Elm[appName].init({
      node: sketchRoot
    });

    let canvas, context;

    let lastT;

    function tick(t) {
      if (t === undefined) {
        lastT = t;
        t = 0.0;
      }

      app.ports.tick.send(t);
      requestAnimationFrame(tick);
    }

    app.ports.started.subscribe(
      (id) => {
        canvas = document.getElementById(id);
        context = canvas.getContext("2d");

        requestAnimationFrame(tick);
      }
    );

    function applyCommand(cmd) {
      // context.save()
      const oldFill = context.fillStyle;
      const oldStroke = context.strokeStyle;
      const oldStrokeWidth = context.strokeWidth;

      context.fillStyle = cmd.fillColor;
      context.strokeStyle = cmd.strokeColor;
      context.strokeWidth = cmd.strokeWidth;

      switch (cmd.shape.type) {
        case "line":
          break;

        case "rect":
          console.log(cmd);
          context.fillRect(...cmd.shape.arguments);
          if (context.strokeWidth > 0.0) {
            context.strokeRect(...cmd.shape.arguments);
          }
          break;
      }

      context.fillStyle = oldFill;
      context.strokeStyle = oldStroke;
      context.strokeWidth = oldStrokeWidth;
    }

    app.ports.submitFrame.subscribe(
      (drawCommands) => {
        drawCommands.forEach(applyCommand);
      }
    )
  });
</script>

<div id="sketchRoot" bind:this={sketchRoot}></div>

<style>
  canvas {
    object-fit: contain;
    aspect-ratio: 1;
    height: auto;
    width: 100%;
  }
</style>
