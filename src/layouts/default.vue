<template>
  <div class="main-layout">
    <header class="page-header">
      <strong>
        <NuxtLink to="/">Tim's Portfolio</NuxtLink>
      </strong>
      <nav class="page-nav">
        <NuxtLink class="page-nav__link" to="/">Home</NuxtLink>
        <NuxtLink class="page-nav__link" to="/about/">About</NuxtLink>
      </nav>
    </header>
    <Nuxt />
  </div>
</template>

<style lang="scss">
:root {
  font-size: 16px;
}

body {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

.main-layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 80px;
}

.page-nav {
  &__link {
    margin-left: 20px;
  }
}
</style>
