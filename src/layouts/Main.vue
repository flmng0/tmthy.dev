<template>
    <div class="main-layout">
        <header class="page-header">
            <strong>
                <g-link to="/">{{ $static.metadata.siteName }}</g-link>
            </strong>
            <nav class="page-nav">
                <g-link class="page-nav__link" to="/">Home</g-link>
                <g-link class="page-nav__link" to="/about/">About</g-link>
            </nav>
        </header>
        <slot />
    </div>
</template>

<static-query>
query {
    metadata {
        siteName
    }
}
</static-query>

<style lang="scss">
:root {
    font-size: 16px;
}

body {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
        Roboto, "Helvetica Neue", Arial, sans-serif;
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
