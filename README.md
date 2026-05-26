# Bantabaa 🌳

A community platform for West African developers to showcase projects, find opportunities, and connect with each other.

**Live site:** https://bantabaa-roots.lovable.app

---

## What is Bantabaa?

*Bantabaa* means "gathering place under the tree" in Mandinka — and that's exactly what this app is. I built it because I noticed that developers in West Africa don't really have a dedicated space to share their work, find jobs, or just connect with other devs in the region.

The app lets you:
- Create a developer profile and show off your skills
- Share projects you've built (with cover images, tech stacks, and stories)
- Browse and post opportunities — jobs, contracts, grants, mentorship
- Join community spaces and have real discussions
- React to and comment on other people's projects

---

## Why I Built This

I wanted to solve a real problem I see in my community: talented developers building amazing things but struggling to get visibility. Most global platforms aren't really designed with West African developers in mind, so I decided to build something that is.

---

## Tech Stack

| What | I used |
|------|--------|
| Frontend | React + TypeScript + Tailwind CSS |
| Framework | TanStack Start (file-based routing + SSR) |
| Backend | Supabase (PostgreSQL database, Auth, Storage) |
| UI Components | shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide |
| Deployment | Cloudflare Workers |

---

## Features

- 🔐 **Auth** — Sign up with email/password or Google OAuth. Includes a multi-step onboarding flow for new users.
- 👤 **Profiles** — Rich developer profiles with avatars, bios, skills, location, and social links.
- 🚀 **Project Showcase** — Share your projects with images, problem/solution writeups, tech stacks, and tags. Others can appreciate and comment on your work.
- 💼 **Opportunities Board** — Post and browse jobs, contracts, grants, and mentorship opportunities with filtering.
- 🏘️ **Community Spaces** — Join discussion forums by topic, career stage, or country.
- 🌙 **Dark Mode** — Full light/dark theme support.
- 📱 **Mobile Friendly** — Works great on phones with a bottom nav bar.

---

## Running It Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/bantabaa.git
   cd bantabaa
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```
   (Or use `npm install` if you don't have Bun)

3. **Set up your environment**
   ```bash
   cp .env.example .env
   ```
   Then fill in your Supabase credentials in `.env`.

4. **Run database migrations**
   ```bash
   bunx supabase db push
   ```

5. **Start the dev server**
   ```bash
   bun run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

---

## What I Learned

This was a huge learning project for me. Some of the things I figured out along the way:

- **Row Level Security (RLS)** — How to lock down database tables so users can only access their own data (and public data)
- **Server Functions** — Using TanStack's `createServerFn` for backend logic that runs at the edge
- **File Uploads** — Handling image uploads to Supabase Storage with proper access controls
- **Auth Flows** — Building a complete auth system with onboarding, password reset, and social login
- **Database Design** — Modeling relationships between users, projects, comments, reactions, and opportunities

---

## What's Next

I'm still actively working on this. Some things on my list:

- [ ] Real-time messaging between users
- [ ] Push notifications
- [ ] Project recommendations based on skills
- [ ] Mentorship scheduling system
- [ ] Multi-language support (French, Wolof, Mandinka)

---

## License

[MIT](./LICENSE) — feel free to use this as a reference or starting point for your own projects.

---

Built with ☀️ in West Africa.
