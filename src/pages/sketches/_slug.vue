<template>
  <div class="container" ref="container">
    <canvas
      id="sketch-canvas"
      class="canvas"
      ref="sketchCanvas"
      width="1000"
      height="1000"
    ></canvas>

    <h1 class="name">{{ sketch.name }}</h1>
    <p class="brief">{{ sketch.brief }}</p>
    <a class="button" :href="sketchSource">View Source</a>

    <nuxt-content class="doc" :document="sketch" />
  </div>
</template>

<script>
const DEFAULT_SIZE = 1000
const SCALE = 0.9

export default {
  head() {
    return {
      title: this.sketch.name,
    }
  },

  async asyncData({ $content, params }) {
    const sketch = await $content('sketches', params.slug).fetch()
    const sketchSource = sketch.source || `/sketches/${sketch.slug}.js`

    return {
      sketch,
      sketchSource,
    }
  },

  mounted() {
    const canvas = this.$refs.sketchCanvas
    const context = canvas.getContext('2d')

    const sketchScript = document.createElement('script')
    sketchScript.src = this.sketchSource
    sketchScript.type = 'module'

    this.$nextTick(() => {
      this.resizeCanvas()
      this.$el.appendChild(sketchScript)
    })
    window.addEventListener('resize', this.resizeCanvas)
  },

  methods: {
    resizeCanvas() {
      const canvas = this.$refs.sketchCanvas

      const containerRect = this.$refs.container.getBoundingClientRect()
      const containerSize = [containerRect.width, containerRect.height]
      const scaledSize = containerSize.map(x => SCALE * x)

      if (scaledSize.some(x => x < DEFAULT_SIZE)) {
        const size = Math.min(...scaledSize)
        canvas.width = size
        canvas.height = size
      } else {
        canvas.width = DEFAULT_SIZE
        canvas.height = DEFAULT_SIZE
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.canvas {
  display: block;
  margin: 0 auto;
  box-shadow: 0 3px 8px rgba(17, 15, 15, 0.3);
}
</style>
