<template>
  <div class="showcase-card card">
    <section class="card__details">
      <span class="card__name">{{ project.name }}</span>
      <p class="card__brief">{{ project.brief }}</p>
    </section>
    <section class="card__links">
      <a :href="project.source" class="card__button">Source</a>
      <a
        v-if="project.type == 'Website'"
        :href="project.ref"
        class="card__button"
        >Website</a
      >
    </section>
  </div>
</template>

<script>
import '~/assets/showcase-card.scss'

export default {
  props: {
    project: Object,
  },
}
</script>

<style lang="scss" scoped>
.card {
  &__name {
    font-size: 1.5rem;
    font-weight: 600;
  }

  &__brief {
    line-height: 1.75em;
  }

  &__button {
    display: block;

    width: 100%;
    height: 2em;

    text-decoration: none;
    text-align: center;

    border-radius: 0.25em;
    border-width: 1px;
    border-style: solid;
    border-color: hsla(0, 0%, 20%, 0.2);

    transition: border-color 100ms linear;

    &:hover {
      border-color: hsla(0, 0%, 20%, 0.8);
    }

    & + & {
      margin-top: 0.75em;
    }
  }
}
</style>
