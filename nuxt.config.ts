// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/icon',
  ],

  // Nuxt 4 future compatibility
  future: {
    compatibilityVersion: 4,
  },

  supabase: {
    redirect: false,
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'NoteForge — Write. Think. Create.',
      meta: [
        { name: 'description', content: 'NoteForge is a modern note-taking app built for thinkers and creators.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap'
        }
      ]
    }
  },
})