# Bantabaa 🌳

> **Where West African developers gather.**
> A professional community platform for developers across West Africa — share your work, find opportunities, and build under the tree.

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 📖 About

**Bantabaa** (Mandinka for *"the gathering place under the tree"*) is the professional home for West African developers. It's where engineers from The Gambia, Senegal, Nigeria, Ghana, and across the region build their identity, showcase real-world projects, discover opportunities, and connect with peers — all in a space designed natively for them.

Built with a "wise community elder" voice and a warm, earthy design language inspired by the baobab tree, Bantabaa goes beyond a generic developer feed. Every interaction — from onboarding to opportunity discovery — is shaped around the realities of building tech in West Africa.

## ✨ Features

### 👤 Developer Profiles
- Rich, customizable profiles with avatar, bio, skills, languages (incl. Wolof, Mandinka, French), and country/city
- "Open to" badges: Work, Freelance, Collaboration, Mentoring
- Verified social links (GitHub, LinkedIn, Twitter, website)
- Public profile pages at `/profile/$handle`

### 🚀 Project Showcase
- Share projects with cover image, problem/solution/lessons, tech stack
- Domain-coded categorization (Fintech, Agritech, Healthtech, Edtech, Govtech, Open Source)
- Real-time reactions (appreciate) and threaded comments
- Edit your own projects; flag projects seeking collaborators

### 💼 Opportunities Board
- Four tracks: **Jobs**, **Contracts**, **Grants**, **Mentorship**
- Rich filters: location type, experience level, compensation, deadline
- Companies and individuals can post; users can save opportunities
- Detail pages with apply CTA and related opportunities

### 🏘️ Community Spaces
- Discussion forums grouped by domain, stage, and country
- Upvote/downvote, replies, pinning
- Membership system per space

### 🔐 Authentication
- Email + password sign-in
- Google OAuth
- Onboarding wizard (7 steps) for new members
- Row Level Security (RLS) on every table

### 🎨 Design & UX
- **Light & dark mode** with semantic `oklch` color tokens
- Mobile-first responsive design with persistent bottom navigation
- Fraunces (display) + DM Sans (body) typography
- Subtle Framer Motion transitions, accessibility-first components
- **Installable PWA** (Add to Home Screen)
- SEO-ready: per-route metadata, Open Graph, Twitter cards, sitemap, robots.txt

## 🛠 Tech Stack

| Layer            | Technology                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| **Framework**    | [TanStack Start](https://tanstack.com/start) v1 (SSR + file-based routing) |
| **UI**           | React 19, TypeScript (strict)                                              |
| **Styling**      | Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com), Framer Motion         |
| **Icons**        | Lucide                                                                     |
| **Data**         | TanStack Query (SWR caching)                                               |
| **Backend**      | Supabase (PostgreSQL, Auth, Storage, Realtime, RLS)                        |
| **Server logic** | TanStack `createServerFn` (typed RPC, runs on Cloudflare Workers)          |
| **Build tool**   | Vite 7                                                                     |
| **Deployment**   | Cloudflare Workers (edge)                                                  |

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0 (or Node.js ≥ 20 + npm)
- A Supabase project (or use [Lovable Cloud](https://lovable.dev) which manages this for you)

### 1. Clone & install

```bash
git clone https://github.com/your-username/bantabaa.git
cd bantabaa
bun install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Server-only (do not prefix with VITE_)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> 💡 If you're working in Lovable, the `.env` file is auto-generated and managed for you.

### 3. Run database migrations

```bash
bunx supabase db push
```

Migrations live in `supabase/migrations/` and define the full schema: profiles, projects, opportunities, spaces, discussions, comments, reactions, and RLS policies.

### 4. Start the dev server

```bash
bun run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### 5. Build for production

```bash
bun run build
```

## 🏗 Architecture

### Routing

File-based routing under `src/routes/`. The Vite plugin auto-generates `routeTree.gen.ts` — never edit it by hand.

```
src/routes/
├── __root.tsx              # Root layout (html, providers, nav, footer)
├── index.tsx               # Landing page
├── login.tsx               # Auth
├── onboarding.tsx          # 7-step new-member flow
├── profile.$handle.tsx     # Public developer profile
├── projects.index.tsx      # Project feed
├── projects.new.tsx        # Share a project (auth-gated)
├── projects.$slug.tsx      # Project detail + comments
├── projects.$slug.edit.tsx # Edit own project
├── opportunities.index.tsx # Opportunities board
├── opportunities.new.tsx   # Post an opportunity (auth-gated)
├── opportunities.$id.tsx   # Opportunity detail
├── spaces.index.tsx        # Community spaces
└── spaces.$slug.tsx        # Space discussions
```

### Server-side logic

App logic uses **TanStack server functions** (`createServerFn`) — typed RPC that runs at the edge. Public webhooks live under `src/routes/api/public/`.

```ts
// Example: protected server function
export const getMyProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    return supabase.from("projects").select("*").eq("builder_id", userId);
  });
```

### Database & security

- All tables have **Row Level Security** enabled
- User roles stored in a dedicated `user_roles` table (never on profiles)
- `has_role()` is a `SECURITY DEFINER` function to avoid recursive RLS
- Realtime enabled on tables that need live updates (e.g. comments)

### Design system

Color tokens live in `src/styles.css` as semantic `oklch` variables. **Never** use raw color classes like `bg-black` in components — always reference tokens (`bg-background`, `text-primary`, etc.).

```css
:root {
  --background: oklch(0.98 0.01 60);
  --kola: oklch(0.72 0.15 70);
  --baobab: oklch(0.35 0.05 50);
  --savanna: oklch(0.55 0.12 140);
}
```

## 📁 Project Structure

```
.
├── public/                 # Static assets, manifest.json, icons
├── src/
│   ├── components/         # Reusable React components (incl. shadcn/ui)
│   ├── data/               # Query helpers and mappers
│   ├── hooks/              # Custom hooks (useAuth, useRequireAuth, ...)
│   ├── integrations/
│   │   └── supabase/       # Auto-generated client, types, middleware
│   ├── lib/                # Utilities + server functions (*.functions.ts)
│   ├── routes/             # File-based routes
│   ├── router.tsx          # Router setup
│   ├── start.ts            # TanStack Start instance
│   └── styles.css          # Tailwind v4 + design tokens
├── supabase/
│   ├── migrations/         # SQL migrations
│   └── config.toml         # Supabase project config
└── vite.config.ts
```

## 🚢 Deployment

Bantabaa is deployed to **Cloudflare Workers** via Wrangler. The Vite build produces an edge-ready bundle.

```bash
bun run build
bunx wrangler deploy
```

When using Lovable, deployment is handled automatically — just hit **Publish**.

## 🤝 Contributing

Contributions are warmly welcomed — Bantabaa is built by and for the community.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional messages: `feat: add mentor matching to spaces`
4. Push and open a Pull Request

Please ensure:
- TypeScript builds without errors (`bun run build`)
- New tables ship with RLS policies
- UI changes respect the design system (semantic tokens, both themes)

## 🗺 Roadmap

- [ ] Native push notifications
- [ ] Real-time direct messaging
- [ ] Skill-based project matching
- [ ] Mentorship scheduling
- [ ] Multi-language UI (French, Wolof, Mandinka)
- [ ] Mobile apps (React Native)

## 📜 License

[MIT](./LICENSE) © Bantabaa contributors

## 🙏 Acknowledgements

- The West African developer community — this is your house
- [TanStack](https://tanstack.com), [Supabase](https://supabase.com), [shadcn/ui](https://ui.shadcn.com), and [Lovable](https://lovable.dev)
- Inspired by the *bantabaa* — the gathering place under the village tree where elders, builders, and dreamers meet

---

<p align="center">
  Built with ☀️ in West Africa.
</p>
