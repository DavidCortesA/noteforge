<script setup lang="ts">
const isScrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})
</script>

<template>
  <nav class="nav" :class="{ 'nav--scrolled': isScrolled }">
    <div class="nav__inner">
      <NuxtLink to="/" class="nav__brand">
        <div class="nav__logo">NF</div>
        <span class="nav__brand-name">NoteForge</span>
      </NuxtLink>

      <div class="nav__links">
        <a href="#features" class="nav__link">Features</a>
      </div>

      <div class="nav__actions">
        <NuxtLink to="/login" class="nav__signin">Sign in</NuxtLink>
        <NuxtLink to="/signup" class="nav__cta">Get started free</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1.25rem 2rem;
  transition: all 0.3s ease;
}

.nav--scrolled {
  background: rgba(245, 240, 232, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-line);
  padding: 0.875rem 2rem;
}

.nav__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--color-ink);
  margin-right: auto;
}

.nav__logo {
  width: 30px;
  height: 30px;
  background: var(--color-ink);
  color: var(--color-amber);
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.nav__brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
}

.nav__links {
  display: flex;
  gap: 1.5rem;
}

.nav__link {
  font-size: 0.88rem;
  color: var(--color-mist);
  text-decoration: none;
  transition: color 0.2s;
}

.nav__link:hover {
  color: var(--color-ink);
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav__signin {
  font-size: 0.88rem;
  color: var(--color-mist);
  text-decoration: none;
  transition: color 0.2s;
}

.nav__signin:hover {
  color: var(--color-ink);
}

.nav__cta {
  padding: 0.5rem 1.125rem;
  background: var(--color-ink);
  color: var(--color-paper);
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.nav__cta:hover {
  background: var(--color-amber);
  transform: translateY(-1px);
}
</style>
