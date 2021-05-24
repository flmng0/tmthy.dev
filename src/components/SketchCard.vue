<template>
  <nuxt-link class="showcase-card card" :to="link">
    <section class="card__details">
      <span class="card__name">{{ sketch.name }}</span>
      <p class="card__brief">{{ sketch.brief }}</p>
    </section>
  </nuxt-link>
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

<style lang="scss" scoped>
.card {
  &__name {
    font-size: 1.5rem;
    font-weight: 600;
  }
}
</style>
