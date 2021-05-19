<template>
  <NuxtLink class="showcase-card sketch-card" :to="link">
    <span class="sketch-card__name">{{ sketch.name }}</span>
    <p class="sketch-card__brief">{{ sketch.brief }}</p>
  </NuxtLink>
</template>

<script>
import '~/assets/showcase-card.scss'

export default {
  data: function() {
    const link = `/sketches/${this.sketch.slug}`

    return {
      link,
    }
  },
  methods: {
    gotoLink: function() {
      console.log(window.location.origin)
    },
  },
  props: {
    sketch: Object,
  },
}
</script>

<style lang="scss">
.sketch-card {
  &__name {
    font-size: 1.5rem;
    font-weight: 600;
  }
}
</style>
