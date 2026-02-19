<template>
  <div class="layout-app">
    <AppSidebar />
    <main class="layout-app__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout-app {
  display: flex;
  min-height: 100vh;
  background: var(--color-cream);
}

.layout-app__main {
  flex: 1;
  overflow: auto;
  padding: 0;
}
</style>
