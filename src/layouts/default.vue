<template>
  <div class="container">
    <header class="header">
      <strong>
        <nuxt-link to="/">Tim's Portfolio</nuxt-link>
      </strong>
      <nav class="nav">
        <nuxt-link class="nav__link" to="/">Home</nuxt-link>
        <nuxt-link class="nav__link" to="/about/">About</nuxt-link>
      </nav>
    </header>
    <nuxt />
    <footer></footer>
  </div>
</template>

<style lang="scss">
:root {
  font-size: 14px;
}

* {
  box-sizing: border-box;
}

a {
  color: currentColor;
}

body {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.5;
}
</style>

<style lang="scss" scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5em;
  height: 5em;
}

.nav {
  &__link {
    & + & {
      margin-left: 20px;
    }
  }
}
</style>
