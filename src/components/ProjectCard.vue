<template>
  <a :href="project.source" class="showcase-card project-card">
    <span class="project-card__name">{{ project.name }}</span>
    <p class="project-card__brief">{{ project.brief }}</p>
  </a>
</template>

<script>
import "~/assets/showcase-card.scss";

export default {
  props: {
    project: Object,
  },
};
</script>

<style lang="scss">
.project-card {
  &__name {
    font-size: 1.5rem;
    font-weight: 600;
  }
}
</style>
