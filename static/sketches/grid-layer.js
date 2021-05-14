const modulo = (n, d) => ((n % d) + d) % d;

class GridLayer {
    constructor(count) {
        // The number of columns.
        this.count = count || 3;
    }

    layout(items) {
        const count = this.count;
        const columns = Array.from({ length: count }, () => []);
        const heights = new Array(count).fill(0);

        let index = 0;

        // For every item, until the stack is empty.
        while (items.length > 0) {
            // The column height before the current one.
            let prevIndex = modulo(index - 1, count);
            let prevHeight = heights[prevIndex];

            // The current column's height.
            let currHeight = heights[index];

            // Keep adding items to the column until it is as tall,
            // or taller than the column before it.
            while (currHeight <= prevHeight && items.length > 0) {
                let item = items.pop();
                let height = item.height;
                let value = item.value;

                currHeight += height;
                columns[index].push(value);
            }
            // Update the height of this column.
            heights[index] = currHeight;
            index = (index + 1) % count;
        }

        return columns;
    }
}

export { GridLayer };

if (window.sketchCanvas) {
    const cvs = window.sketchCanvas;
    const ctx = cvs.getContext("2d");

    const rng = (m, M) => Math.round(m + (M - m) * Math.random());
    const COLUMNS = 4;
    const layer = new GridLayer(COLUMNS);

    function generateColumns() {
        const minHeight = cvs.width / 8;
        const maxHeight = minHeight * 2;
        const items = Array.from({ length: 15 }, () => rng(minHeight, maxHeight)).map(height => {
            return {
                "height": height,
                "value": height,
            };
        });

        return layer.layout(items);
    }

    ctx.fillStyle = "lightgrey";
    ctx.strokeStyle = "green";

    let columns = generateColumns();

    function draw() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        for (const [i, column] of columns.entries()) {
            let x = i * cvs.width / COLUMNS;
            let y = 0;

            for (const item of column) {
                let rect = [x, y, cvs.width / COLUMNS, item];

                ctx.fillRect(...rect);
                ctx.strokeRect(...rect);

                y += item;
            }
        }

        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);

    cvs.addEventListener("mousedown", function (e) {
        // if (e.keyCode == 32) {
        columns = generateColumns();
        // }
    });

    cvs.addEventListener("touchend", function (e) {
        columns = generateColumns();
    });
}
