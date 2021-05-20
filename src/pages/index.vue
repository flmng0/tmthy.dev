<template>
  <div>
    <section class="showcase project-showcase">
      <h2 class="showcase__title">Projects</h2>
      <ul class="showcase__list">
        <project-card
          v-for="project of this.projects"
          :key="project.slug"
          :project="project"
        />
      </ul>
    </section>

    <section class="showcase sketch-showcase">
      <h2 class="showcase__title">Creative Coding</h2>
      <ul class="showcase__list">
        <sketch-card
          v-for="sketch of this.sketches"
          :key="sketch.slug"
          :sketch="sketch"
        />
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Home',
  },

  async asyncData({ $content }) {
    const projects = await $content('projects').fetch()
    const sketches = await $content('sketches').fetch()

    return {
      projects,
      sketches,
    }
  },
}
</script>

<style lang="scss">
.showcase {
  &__title {
    font-size: 2rem;
    text-align: center;
  }

  &__list {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;

    // outline: 1px solid red;

    margin: 0 auto;
    padding-left: 0;
  }
}
</style>
