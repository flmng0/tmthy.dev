export function runSketch(sketchInit, canvas) {
  const sketch = sketchInit();

  sketch.ports.setup.subscribe((args) => {
    let runner;
    if (args.type == "2d") {
      runner = runSketch2d;
    }
    if (args.type === "3d") {
      runner = runSketch3d;
    }

    if (runner === undefined) {
      throw new Error("Unknown sketch arguments: " + JSON.stringify(args));
    }

    window.requestAnimationFrame((t) => {
      runner(sketch, canvas, t);
    });
  });
}

/** @param {HTMLCanvasElement} canvas */
function runSketch2d(sketch, canvas, startTime) {
  const context = canvas.getContext("2d");

  function tick(t) {
    const ts = (t - startTime) / 1000;
    sketch.ports.tick.send(ts);

    window.requestAnimationFrame(tick);
  }

  const hasStroke = (context) => context.strokeStyle !== "transparent";
  const hasFill = (context) => context.fillStyle !== "transparent";

  const shapeHandlers = {
    text({ text }, x, y) {
      hasFill(context) && context.fillText(text, x, y);
      hasStroke(context) && context.strokeText(text, x, y);
    },
    rect({ width, height }, x, y) {
      hasFill(context) && context.fillRect(x, y, width, height);
      hasStroke(context) && context.strokeRect(x, y, width, height);
    },
    circle({ radius }, x, y) {
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      hasFill(context) && context.fill();
      hasStroke(context) && context.stroke();
    },
    lineTo({ x2, y2 }, x1, y1) {
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    },
  };

  const commandHandlers = {
    draw({ x, y, shape }) {
      const { type, ...args } = shape;
      const handler = shapeHandlers[type];
      handler(args, x, y);
    },
    setTransform({ matrix }) {
      // console.log("setTransform", matrix);
    },
    setFill({ color }) {
      const { r, g, b } = color;
      context.fillStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
    },
    setStroke({ width, color }) {
      if (width > 0.001) {
        const { r, g, b } = color;
        context.strokeStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
        context.lineWidth = width;
      } else {
        context.strokeStyle = "transparent";
        context.lineWidth = 0;
      }
    },
  };

  sketch.ports.draw.subscribe((commands) => {
    for (const { command, ...args } of commands) {
      const handler = commandHandlers[command];
      handler(args);
    }
  });

  console.log(context);

  window.requestAnimationFrame(tick);
}

function runSketch3d(sketch, canvas, startTime) {}
