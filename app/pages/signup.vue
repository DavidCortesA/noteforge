<script setup lang="ts">
definePageMeta({ layout: 'default' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

watchEffect(() => {
  if (user.value) router.push('/app')
})

async function handleSignup() {
  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }
  loading.value = true
  error.value = ''

  const { error: err } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: { full_name: form.name },
    },
  })

  loading.value = false
  if (err) {
    error.value = err.message
  } else {
    success.value = true
  }
}
</script>

<template>
  <div class="auth-page">
    <NuxtLink to="/" class="auth-page__back">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Back home
    </NuxtLink>

    <div class="auth-page__card">
      <div class="auth-page__brand">
        <div class="auth-page__logo">NF</div>
        <span class="auth-page__brand-name">NoteForge</span>
      </div>

      <template v-if="!success">
        <div class="auth-page__header">
          <h1>Create your account</h1>
          <p>Start forging your thoughts today — it's free</p>
        </div>

        <form @submit.prevent="handleSignup" class="auth-form">
          <div class="form-field">
            <label for="name">Full name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Jane Smith"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-field">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-field">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="At least 6 characters"
              required
              :disabled="loading"
            />
          </div>

          <div v-if="error" class="form-error">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
              <path d="M7 4v3M7 10h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" class="btn btn--primary btn--full" :disabled="loading">
            <span v-if="loading" class="spinner" />
            <span v-else>Create account</span>
          </button>
        </form>
      </template>

      <div v-else class="success-state">
        <div class="success-state__icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16l7 7L26 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2>Check your email!</h2>
        <p>We sent a confirmation link to <strong>{{ form.email }}</strong>. Click it to activate your account.</p>
        <NuxtLink to="/login" class="btn btn--primary">Back to login</NuxtLink>
      </div>

      <p class="auth-page__switch" v-if="!success">
        Already have an account?
        <NuxtLink to="/login">Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Shared styles from login page */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--color-paper);
}

.auth-page__back {
  position: fixed;
  top: 2rem;
  left: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-mist);
  text-decoration: none;
  transition: color 0.2s;
  font-family: var(--font-mono);
  z-index: 10;
}

.auth-page__back:hover { color: var(--color-ink); }

.auth-page__card {
  background: white;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-lg);
  padding: 3rem;
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow-card);
  position: relative;
  z-index: 1;
  animation: fadeUp 0.5s ease forwards;
}

.auth-page__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.auth-page__logo {
  width: 36px;
  height: 36px;
  background: var(--color-ink);
  color: var(--color-amber);
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
}

.auth-page__brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-ink);
}

.auth-page__header {
  margin-bottom: 2rem;
}

.auth-page__header h1 {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-ink);
  margin-bottom: 0.35rem;
}

.auth-page__header p {
  color: var(--color-mist);
  font-size: 0.9rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-ink);
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
}

.form-field input {
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--color-line);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-ink);
  background: var(--color-paper);
  transition: border-color 0.2s;
  outline: none;
}

.form-field input:focus { border-color: var(--color-amber); }
.form-field input:disabled { opacity: 0.6; cursor: not-allowed; }

.form-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-rust);
  font-size: 0.85rem;
  padding: 0.75rem;
  background: rgba(139, 58, 42, 0.08);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(139, 58, 42, 0.2);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  text-decoration: none;
}

.btn--primary {
  background: var(--color-ink);
  color: var(--color-paper);
  border-color: var(--color-ink);
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-amber);
  border-color: var(--color-amber);
}

.btn--primary:disabled { opacity: 0.7; cursor: not-allowed; }
.btn--full { width: 100%; }

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(245, 240, 232, 0.3);
  border-top-color: var(--color-paper);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.auth-page__switch {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-mist);
}

.auth-page__switch a {
  color: var(--color-amber-dark);
  font-weight: 500;
  text-decoration: none;
}

.success-state {
  text-align: center;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.success-state__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(74, 92, 74, 0.1);
  color: var(--color-sage);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.success-state h2 {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-ink);
}

.success-state p {
  color: var(--color-mist);
  line-height: 1.6;
  max-width: 300px;
}
</style>
