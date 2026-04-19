
# Bantabaa — Build Plan

A warm, rooted, modern community platform for West African developers. This first build focuses on a complete, polished **frontend experience** with the full design system, all six core pages, mobile-first responsive layouts, and dark mode. Auth and database wiring can come in a follow-up pass once the UI shape is approved.

## Tech adjustments (important)

The brief specifies Next.js 14 + Supabase. This project runs on **TanStack Start + React 19 + Tailwind v4**, which is what Lovable supports. I'll deliver the same experience on this stack:
- Routing via TanStack file-based routes (separate routes per page, not hash anchors)
- Tailwind v4 design tokens in `src/styles.css` (Baobab Brown, Kola Gold, Savanna Green, Warm Cream, Deep Night)
- Fraunces + DM Sans via Google Fonts
- Lucide icons, Framer Motion for subtle transitions
- Auth/DB will use **Lovable Cloud** (Supabase under the hood) when we wire it up — flagged as a follow-up

## Design system (foundation)

- Color tokens in `src/styles.css` for both light (Warm Cream base) and dark (Deep Night base) modes — all in oklch
- Typography: Fraunces for H1–H3, DM Sans for everything else, full type scale wired as Tailwind utilities
- Logo: custom abstract baobab SVG (canopy as connected nodes) + "Bantabaa" wordmark in Fraunces Bold — full color, mono-white, mono-dark variants
- Reusable components: `Navigation`, `Footer`, `DeveloperCard`, `ProjectCard`, `OpportunityCard`, `TagPill`, `Badge`, `ReactionStrip`, `EmptyState`, `LoadingSkeleton`, `ThemeToggle`, `MobileBottomNav`
- Toast via existing Sonner setup (themed to brand)
- Dark mode toggle in nav, respects system preference, persisted

## Pages (each as its own TanStack route with unique SEO meta)

1. **`/` Landing** — sticky nav, hero with subtle baobab background, scrolling locations strip, three value-prop cards, horizontal developer profile showcase, 3-card project preview grid, dark "For Companies" section, partners row, waitlist CTA, footer
2. **`/profile/$handle` Developer Profile** — warm header with gold-ringed avatar, open-to badge, social links, About me, skills as grouped pills (no progress bars), featured project card, projects grid, community stats blocks, verified badges row, sticky Collaborate sidebar (desktop) / bottom CTA (mobile). Includes a sample profile so it's viewable immediately.
3. **`/projects` Project Showcase Feed** — header + "Share Your Project" CTA, filter bar (Domain / Stack / Country / Sort), responsive card grid with domain-color-coded tags, reaction strip
4. **`/projects/$slug` Project Detail** — cover, problem/solution/lessons sections, tech stack, builder card, links, collaborators-wanted, discussion thread placeholder
5. **`/opportunities` Opportunities Board** — Jobs / Contracts / Grants / Mentorship tabs, filter bar, list-style cards, sticky "Post an Opportunity" banner
6. **`/opportunities/$id` Opportunity Detail** — full description, requirements as tags, compensation, apply CTA, related opportunities
7. **`/onboarding` Flow** — 7-step wizard with progress bar, warm microcopy, single-route with internal step state. Steps: account → identity (incl. Wolof/Mandinka/French) → skills → story → open-to → first project (skippable) → welcome
8. **`/spaces` Community Spaces** — grid of space cards (by domain, by stage, by country with "coming soon" tags)
9. **`/spaces/$slug` Space Detail** — discussion thread feed scaffold with post / upvote / reply UI

All routes have unique `head()` meta (title, description, og:title, og:description) per the route architecture rules.

## Mobile experience

- Mobile-first layouts tested at 390px
- Hamburger drawer in top nav
- Persistent bottom nav (Home / Projects / Opportunities / Spaces / Profile) on mobile only
- 44px+ touch targets, thumb-zone primary actions
- Skeleton loaders, lazy images

## PWA

The brief requests PWA. Per platform guidance, service workers misbehave inside the Lovable preview iframe. I'll ship a **manifest.json + icons + theme color + standalone display** so the app is installable (Add to Home Screen) without registering a service worker. Full offline support can be added post-launch when deployed.

## Tone & copy

All microcopy follows the "wise community elder" voice — "gather", "share", "under the tree", warm empty states, encouraging onboarding prompts.

## Out of scope for this first build (follow-ups)

- Real auth (Lovable Cloud email + GitHub OAuth)
- Database schema for profiles, projects, opportunities, spaces, posts
- File uploads for avatars / project covers
- Real reactions, comments, bookmarks, search

These come once the UI is approved so we wire data into a shape you've already signed off on.

## Deliverable after this build

A fully navigable, beautiful, responsive Bantabaa frontend with sample content across every page, dark mode, and installable manifest — ready to demo to partners and ready for backend wiring next.
