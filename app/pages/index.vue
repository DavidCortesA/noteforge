<script setup lang="ts">
const user = useSupabaseUser()

// Redirect to app if already logged in
watchEffect(() => {
  if (user.value) {
    navigateTo('/app')
  }
})
</script>

<template>
  <div class="marketing">
    <MarketingNav />

    <!-- Hero -->
    <section class="hero">
      <div class="hero__bg">
        <div class="hero__lines">
          <div v-for="i in 8" :key="i" class="hero__line" :style="`animation-delay: ${i * 0.1}s`" />
        </div>
        <div class="hero__orb hero__orb--1" />
        <div class="hero__orb hero__orb--2" />
      </div>
      <div class="container">
        <div class="hero__content">
          <div class="hero__badge">
            <span class="hero__badge-dot" />
            <span>Now in public beta</span>
          </div>
          <h1 class="hero__title">
            The notebook<br />
            <em>for people who think.</em>
          </h1>
          <p class="hero__subtitle">
            NoteForge gives your ideas a permanent home. Write freely, organize effortlessly, and never lose a thought again.
          </p>
          <div class="hero__actions">
            <NuxtLink to="/signup" class="btn btn--primary">
              Start writing for free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </NuxtLink>
            <NuxtLink to="/login" class="btn btn--ghost">Sign in</NuxtLink>
          </div>
          <p class="hero__note">No credit card required. Free forever for personal use.</p>
        </div>
        <div class="hero__visual">
          <div class="hero__notebook">
            <div class="hero__notebook-inner">
              <div class="hero__notebook-line" v-for="i in 12" :key="i" :style="`opacity: ${1 - i * 0.06}; animation-delay: ${i * 0.08}s`" />
              <div class="hero__notebook-cursor" />
            </div>
            <div class="hero__notebook-shadow" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features" id="features">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Why NoteForge</span>
          <h2 class="section-title">Built for the way <em>you</em> think</h2>
        </div>
        <div class="features__grid">
          <div class="feature-card feature-card--large">
            <div class="feature-card__icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M4 6h20M4 12h14M4 18h17M4 24h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="feature-card__title">Distraction-free writing</h3>
            <p class="feature-card__desc">A clean canvas that gets out of your way. Just you and your thoughts, nothing else.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <rect x="14" y="4" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <rect x="4" y="14" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <rect x="14" y="14" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
              </svg>
            </div>
            <h3 class="feature-card__title">Smart organization</h3>
            <p class="feature-card__desc">Notes that sort themselves so you can find anything in seconds.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 4C8.477 4 4 8.477 4 14s4.477 10 10 10 10-4.477 10-10S19.523 4 14 4z" stroke="currentColor" stroke-width="1.8"/>
                <path d="M14 9v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="feature-card__title">Always synced</h3>
            <p class="feature-card__desc">Your notes follow you everywhere. Pick up where you left off on any device.</p>
          </div>
          <div class="feature-card feature-card--accent">
            <div class="feature-card__icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 3l2.8 8.4h8.8l-7.1 5.2 2.7 8.4L14 20l-7.2 5 2.7-8.4L2.4 11.4h8.8L14 3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="feature-card__title">Private by default</h3>
            <p class="feature-card__desc">Your thoughts are yours. End-to-end security powered by Supabase.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container">
        <div class="cta__inner">
          <div class="cta__stamp">NF</div>
          <h2 class="cta__title">Ready to forge your thoughts?</h2>
          <p class="cta__subtitle">Join thousands of writers, thinkers, and creators who've made NoteForge their digital notebook.</p>
          <NuxtLink to="/signup" class="btn btn--primary btn--lg">
            Create your free account
          </NuxtLink>
        </div>
      </div>
    </section>

    <MarketingFooter />
  </div>
</template>

<style scoped>
/* ---- Hero ---- */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: 8rem 0 4rem;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__lines {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0;
  pointer-events: none;
}

.hero__line {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--color-line) 30%, var(--color-line) 70%, transparent 100%);
  opacity: 0;
  animation: fadeIn 1s ease forwards;
}

.hero__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.hero__orb--1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(200, 136, 42, 0.15) 0%, transparent 70%);
  top: -100px;
  right: -100px;
}

.hero__orb--2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 58, 42, 0.1) 0%, transparent 70%);
  bottom: -80px;
  left: -80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(200, 136, 42, 0.1);
  border: 1px solid rgba(200, 136, 42, 0.3);
  padding: 0.35rem 0.75rem;
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-amber-dark);
  letter-spacing: 0.05em;
  width: fit-content;
  animation: fadeUp 0.5s ease forwards;
}

.hero__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-amber);
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 5vw, 4.5rem);
  font-weight: 900;
  line-height: 1.1;
  color: var(--color-ink);
  animation: fadeUp 0.6s 0.1s ease forwards;
  opacity: 0;
}

.hero__title em {
  font-style: italic;
  color: var(--color-amber);
}

.hero__subtitle {
  font-size: 1.15rem;
  color: var(--color-mist);
  max-width: 460px;
  line-height: 1.7;
  animation: fadeUp 0.6s 0.2s ease forwards;
  opacity: 0;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  animation: fadeUp 0.6s 0.3s ease forwards;
  opacity: 0;
}

.hero__note {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-mist);
  animation: fadeUp 0.6s 0.4s ease forwards;
  opacity: 0;
}

/* Notebook visual */
.hero__visual {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeUp 0.8s 0.2s ease forwards;
  opacity: 0;
}

.hero__notebook {
  position: relative;
  width: 320px;
  height: 420px;
}

.hero__notebook-inner {
  position: absolute;
  inset: 0;
  background: var(--color-paper);
  border: 2px solid var(--color-line-dark);
  border-radius: var(--radius-md);
  padding: 2rem;
  box-shadow: var(--shadow-paper);
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  overflow: hidden;
}

.hero__notebook-inner::before {
  content: 'NoteForge';
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--color-amber);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.hero__notebook-line {
  height: 1px;
  background: var(--color-line);
  border-radius: 1px;
  position: relative;
  animation: slideInLine 0.8s ease forwards;
}

@keyframes slideInLine {
  from { transform: scaleX(0); transform-origin: left; }
  to { transform: scaleX(1); }
}

.hero__notebook-cursor {
  width: 2px;
  height: 18px;
  background: var(--color-amber);
  margin-top: 0.25rem;
  animation: blink 1s ease infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero__notebook-shadow {
  position: absolute;
  top: 12px;
  left: 12px;
  right: -12px;
  bottom: -12px;
  background: var(--color-line-dark);
  border-radius: var(--radius-md);
  z-index: -1;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.btn--primary {
  background: var(--color-ink);
  color: var(--color-paper);
  border-color: var(--color-ink);
}

.btn--primary:hover {
  background: var(--color-amber);
  border-color: var(--color-amber);
  color: var(--color-paper);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(200, 136, 42, 0.35);
}

.btn--ghost {
  background: transparent;
  color: var(--color-ink);
  border-color: var(--color-line-dark);
}

.btn--ghost:hover {
  border-color: var(--color-ink);
  transform: translateY(-2px);
}

.btn--lg {
  padding: 1rem 2rem;
  font-size: 1rem;
}

/* Features */
.features {
  padding: 6rem 0;
}

.features .container {
  display: block;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-amber);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.75rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 700;
  color: var(--color-ink);
}

.section-title em {
  font-style: italic;
  color: var(--color-amber);
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 1.5rem;
}

.feature-card {
  background: white;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--color-amber);
}

.feature-card--large {
  grid-column: 1 / 3;
}

.feature-card--accent {
  background: var(--color-ink);
  color: var(--color-paper);
  border-color: var(--color-ink);
}

.feature-card--accent .feature-card__desc {
  color: rgba(245, 240, 232, 0.7);
}

.feature-card__icon {
  width: 48px;
  height: 48px;
  background: rgba(200, 136, 42, 0.1);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-amber);
  margin-bottom: 1.25rem;
}

.feature-card--accent .feature-card__icon {
  background: rgba(245, 240, 232, 0.1);
  color: var(--color-amber-light);
}

.feature-card__title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-ink);
}

.feature-card--accent .feature-card__title {
  color: var(--color-paper);
}

.feature-card__desc {
  font-size: 0.95rem;
  color: var(--color-mist);
  line-height: 1.65;
}

/* CTA */
.cta {
  padding: 6rem 0;
}

.cta .container {
  display: block;
}

.cta__inner {
  background: var(--color-ink);
  border-radius: var(--radius-lg);
  padding: 5rem 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta__inner::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 136, 42, 0.2) 0%, transparent 70%);
}

.cta__stamp {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 900;
  color: var(--color-amber);
  opacity: 0.2;
  position: absolute;
  top: 1rem;
  left: 2rem;
  line-height: 1;
  letter-spacing: -0.05em;
}

.cta__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  color: var(--color-paper);
  margin-bottom: 1rem;
}

.cta__subtitle {
  font-size: 1.05rem;
  color: rgba(245, 240, 232, 0.6);
  max-width: 480px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
}

.cta .btn--primary {
  background: var(--color-amber);
  border-color: var(--color-amber);
  color: white;
}

.cta .btn--primary:hover {
  background: var(--color-amber-light);
  border-color: var(--color-amber-light);
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }

  .hero__visual {
    display: none;
  }

  .features__grid {
    grid-template-columns: 1fr;
  }

  .feature-card--large {
    grid-column: 1;
  }
}
</style>
