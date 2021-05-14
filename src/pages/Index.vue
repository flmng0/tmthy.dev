<template>
    <div>
        <section class="showcase project-showcase">
            <h2 class="showcase__title">Projects</h2>
            <ul class="showcase__list">
                <project-card
                    v-for="edge in $page.projects.edges"
                    :key="edge.node.source"
                    :project="edge.node"
                />
            </ul>
        </section>

        <section class="showcase sketch-showcase">
            <h2 class="showcase__title">Creative Coding</h2>
            <ul class="showcase__list">
                <sketch-card
                    v-for="edge in $page.sketches.edges"
                    :key="edge.node.stub"
                    :sketch="edge.node"
                />
            </ul>
        </section>
    </div>
</template>

<page-query>
query {
    projects: allProject {
        edges {
            node {
                source
                name
                brief
            }
        }
    }
    sketches: allSketch {
        edges {
            node {
                source
                stub
                name
                brief
            }
        }
    }
}
</page-query>

<script>
import ProjectCard from "~/components/ProjectCard.vue";
import SketchCard from "~/components/SketchCard.vue";

export default {
    components: {
        SketchCard,
        ProjectCard,
    },
    metaInfo: {
        title: "Home",
    },
};
</script>

<style lang="scss">
.showcase {
    &__title {
        font-size: 2rem;
        text-align: center;
    }

    &__list {
        padding-left: 0;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
