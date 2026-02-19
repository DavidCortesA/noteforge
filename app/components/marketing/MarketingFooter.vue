<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__logo">NF</div>
        <span>NoteForge</span>
      </div>
      <p class="footer__copy">
        © {{ new Date().getFullYear() }} NoteForge. Made with care for writers everywhere.
      </p>
      <div class="footer__links">
        <NuxtLink to="/login">Login</NuxtLink>
        <NuxtLink to="/signup">Sign up</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-line);
  padding: 2.5rem;
}

.footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-ink);
  margin-right: auto;
}

.footer__logo {
  width: 24px;
  height: 24px;
  background: var(--color-ink);
  color: var(--color-amber);
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
}

.footer__copy {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-mist);
}

.footer__links {
  display: flex;
  gap: 1.25rem;
}

.footer__links a {
  font-size: 0.82rem;
  color: var(--color-mist);
  text-decoration: none;
  transition: color 0.2s;
}

.footer__links a:hover {
  color: var(--color-ink);
}
</style>
