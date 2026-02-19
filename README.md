# NoteForge ✒️

> A modern, distraction-free note-taking app built with Nuxt 4 and Supabase.

![NoteForge](./public/og-image.png)

## ✨ Features

- **Marketing landing page** with hero, features, and CTA sections
- **User authentication** (sign up, sign in) via Supabase Auth
- **Private notes dashboard** — create, edit, delete notes
- **Auto-save** — notes save automatically as you type
- **Search** — filter notes by title or content
- **Row Level Security** — users can only see their own notes
- **Responsive** design

## 🛠 Tech Stack

- **Framework**: Nuxt 4 (with `compatibilityVersion: 4`)
- **Auth & DB**: [Supabase](https://supabase.com) via `@nuxtjs/supabase`
- **UI**: `@nuxt/ui` + custom CSS design system
- **Utilities**: `@vueuse/nuxt` for composables
- **Icons**: `@nuxt/icon`
- **Fonts**: Playfair Display, DM Mono, DM Sans (Google Fonts)

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone <your-repo>
cd noteforge
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
```

### 4. Enable Email Auth in Supabase

Go to **Authentication → Providers** and ensure **Email** is enabled.  
For development, you can disable email confirmation under **Authentication → Settings**.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
noteforge/
├── pages/
│   ├── index.vue          # Marketing landing page
│   ├── login.vue          # Sign in page
│   ├── signup.vue         # Create account page
│   └── app.vue            # Notes dashboard (protected)
├── layouts/
│   ├── default.vue        # Marketing layout
│   └── app.vue            # App layout (with sidebar)
├── components/
│   └── marketing/
│       ├── MarketingNav.vue
│       └── MarketingFooter.vue
├── middleware/
│   └── auth.ts            # Route guard for /app
├── assets/css/
│   └── main.css           # Design system & global styles
├── supabase-schema.sql    # Database schema to run in Supabase
├── nuxt.config.ts
└── .env.example
```

## 🗃️ Database Schema

The `notes` table:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key → auth.users |
| `title` | TEXT | Note title |
| `content` | TEXT | Note body |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update (auto-managed) |

Row Level Security (RLS) is enabled — users can **only** read, write, and delete their own notes.

## 🎨 Design System

NoteForge uses a warm paper-and-ink aesthetic:

- **Colors**: Cream/paper background, ink text, amber accents
- **Fonts**: Playfair Display (headings) + DM Mono (body/code) + DM Sans (UI)
- **Style**: Editorial, literary, distraction-free

## 📦 Build for Production

```bash
npm run build
npm run preview
```

## 🌐 Deploy

Works on Vercel, Netlify, or any Node.js host:

```bash
# Vercel
npx vercel

# Netlify
npx netlify deploy
```

Make sure to set your `SUPABASE_URL` and `SUPABASE_KEY` environment variables in your hosting dashboard.
