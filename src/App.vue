<template>
    <MainLayout>
        <router-view />
    </MainLayout>
</template>

<script>
import MainLayout from "~/layouts/Main.vue";

export default {
    components: {
        MainLayout,
    },
};
</script>
