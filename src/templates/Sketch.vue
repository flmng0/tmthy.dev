<template>
    <div class="sketch">
        <canvas
            class="sketch__canvas"
            v-bind:width="canvasWidth"
            v-bind:height="canvasHeight"
            ref="sketchCanvas"
        />
        <h1 class="sketch__title" v-html="$page.sketch.name" />
        <p class="sketch__brief" v-html="$page.sketch.brief" />
        <div v-if="$page.sketch.instructions.length">
            <strong class="sketch__instruction-label">Instructions</strong>
            <ul class="sketch__instructions">
                <li
                    v-for="instruction in $page.sketch.instructions"
                    :key="instruction"
                    v-html="instruction"
                ></li>
            </ul>
        </div>
    </div>
</template>

<page-query>
query Sketch($id: ID!) {
    sketch(id: $id) {
        source
        name
        brief
        instructions
    }
}
</page-query>

<script>
const DEFAULT_WIDTH = 512;
const DEFAULT_HEIGHT = 512;

function getCanvasSize() {
    let width = DEFAULT_WIDTH;
    let height = DEFAULT_HEIGHT;

    if (window.innerWidth < width || window.innerHeight < height) {
        const size = window.innerWidth * 0.95;
        width = height = size;
    }

    return [width, height];
}

export default {
    data: function () {
        const [width, height] = getCanvasSize();

        return {
            canvasWidth: width,
            canvasHeight: height,
        };
    },
    mounted: function () {
        window.addEventListener("resize", this.resizeCanvas);

        window.sketchCanvas = this.$refs.sketchCanvas;

        console.log(this.$page.sketch.instructions);

        const sketchScript = document.createElement("script");
        sketchScript.type = "module";
        sketchScript.src = `/sketches/${this.$page.sketch.source}`;

        document.head.appendChild(sketchScript);
    },
    methods: {
        resizeCanvas: function () {
            const [width, height] = getCanvasSize();
            this.canvasWidth = width;
            this.canvasHeight = height;
        },
    },
    metaInfo: function () {
        return {
            title: this.$page.sketch.name,
        };
    },
};
</script>

<style lang="scss">
.sketch {
    display: flex;
    flex-flow: column nowrap;

    &__canvas {
        align-self: center;
        box-shadow: 2px 1px 8px rgba(0.1, 0.1, 0.13, 0.3);
    }

    &__instruction-label {
        font-size: 1.5rem;
    }
}
</style>
