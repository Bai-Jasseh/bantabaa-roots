import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Compass, Users2, ChevronDown, ShieldCheck, MessagesSquare, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeveloperCard } from "@/components/DeveloperCard";
import { ProjectCard } from "@/components/ProjectCard";
import { TagPill } from "@/components/TagPill";
import { Reveal, RevealStagger } from "@/components/motion/Reveal";
import { CountUp } from "@/components/CountUp";
import { fetchAllProfiles, fetchProjectsWithBuilders, profileToDeveloper } from "@/data/queries";
import heroBaobab from "@/assets/hero-baobab.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bantabaa — Where Gambian developers gather" },
      { name: "description", content: "The professional home for West African developers. Build your identity, showcase your work, and find your opportunity." },
      { property: "og:title", content: "Bantabaa — Where Gambian developers gather" },
      { property: "og:description", content: "A gathering place for West African developers, starting in The Gambia." },
    ],
  }),
  loader: async () => {
    const [profiles, projects] = await Promise.all([fetchAllProfiles(), fetchProjectsWithBuilders()]);
    return {
      developers: profiles.slice(0, 12).map(profileToDeveloper),
      projects: projects.slice(0, 3).map((p) => p.project),
    };
  },
  errorComponent: ({ error }) => <div className="mx-auto max-w-md py-32 text-center text-muted-foreground">{error.message}</div>,
  component: LandingPage,
});

const LOCATIONS = ["Banjul", "Serrekunda", "Brikama", "Dakar", "Saint-Louis", "Accra", "Kumasi", "Freetown", "Lagos", "Abuja"];

function ScrollHint() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (hidden) return null;
  return (
    <div
      aria-hidden
      className="mt-10 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground transition-opacity duration-500"
    >
      <span>More under the tree</span>
      <ChevronDown className="size-4 animate-gentle-bounce text-[var(--kola)]" />
    </div>
  );
}

function LandingPage() {
  const reduce = useReducedMotion();
  const { developers, projects } = Route.useLoaderData();

  return (
    <>
      {/* HERO */}
      <section className="hero-warm-overlay relative overflow-hidden">
        <div className="absolute inset-0 bg-baobab-pattern" aria-hidden />
        <motion.img
          src={heroBaobab}
          alt=""
          aria-hidden
          loading="eager"
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-right opacity-25 mix-blend-multiply md:opacity-30 dark:opacity-35 dark:mix-blend-screen"
          animate={reduce ? undefined : { scale: [1, 1.02, 1] }}
          transition={reduce ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-20 md:grid-cols-12 md:px-6 md:py-32">
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <TagPill className="mb-6">🌳 A gathering place for West African developers</TagPill>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
              className="font-display text-[40px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[64px]"
            >
              Where Gambian<br />developers <em className="not-italic text-[var(--kola)]">gather.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              Bantabaa is the professional home for West African developers — build your identity, showcase your work, and find your opportunity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link to="/onboarding">
                <Button size="lg" className="h-12 w-full bg-[var(--kola)] px-8 text-base text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90 sm:w-auto">
                  Join the Bantabaa
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="h-12 w-full border-[var(--baobab)]/20 px-8 text-base sm:w-auto">
                  Explore projects
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.65 }}
              className="mt-4 text-sm text-muted-foreground"
            >
              Free to join. Built for you. No CV required.
            </motion.p>

            <ScrollHint />
          </div>
        </div>

        {/* LOCATIONS MARQUEE — pausable */}
        <div className="marquee-pause relative border-y border-[var(--baobab)]/30 bg-[var(--baobab)] py-4 shadow-warm">
          <div className="flex overflow-hidden">
            <div className="flex shrink-0 animate-marquee gap-10 whitespace-nowrap pr-10 text-base font-medium text-[var(--baobab-foreground)]">
              {[...LOCATIONS, ...LOCATIONS].map((c, i) => (
                <span key={i} className="inline-flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-[var(--kola)]" />
                  Built by developers in <span className="font-semibold text-[var(--kola)]">{c}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF STATS */}
      <section className="border-y border-[#E8DDD4] bg-[var(--cream)] py-14 dark:border-border dark:bg-card/40">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 text-center sm:grid-cols-3 md:px-6">
          {[
            { to: 500, suffix: "+", label: "Developers" },
            { to: 20, suffix: "+", label: "Projects shared" },
            { to: 10, suffix: "+", label: "Opportunities posted" },
          ].map((s) => (
            <div key={s.label}>
              <CountUp
                to={s.to}
                suffix={s.suffix}
                className="font-display text-5xl font-bold text-[var(--kola)] md:text-6xl"
              />
              <p className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <RevealStagger className="grid gap-6 md:grid-cols-3" stagger={0.15}>
          {[
            { icon: Sparkles, title: "Be Visible", body: "Your work, your skills, and your story — seen by the people who matter." },
            { icon: Compass, title: "Find Opportunity", body: "Jobs, contracts, grants, and mentorship — all in one place built for you." },
            { icon: Users2, title: "Grow Together", body: "A community that understands your context, your challenges, and your ambition." },
          ].map(({ icon: Icon, title, body }) => (
            <Reveal key={title} className="rounded-3xl border border-border bg-card p-8 shadow-soft">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--kola)]/15 text-[var(--kola)]">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-muted-foreground">{body}</p>
            </Reveal>
          ))}
        </RevealStagger>
      </section>

      {/* DEVELOPER SHOWCASE — auto-scrolling, pausable */}
      <section className="border-y border-border bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-label text-[var(--kola)]">Under the tree</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-foreground md:text-4xl">Developers you should know</h2>
            </div>
            <Link to="/spaces" className="hidden text-sm font-medium text-foreground hover:text-[var(--kola)] md:inline-flex">
              See the community →
            </Link>
          </div>
        </div>
        {/* Mobile: native horizontal scroll. Desktop: auto-marquee, pausable on hover. */}
        {developers.length === 0 ? (
          <div className="mx-auto mt-8 max-w-md px-4 text-center text-sm text-muted-foreground">No developers have joined yet — be the first.</div>
        ) : (
          <>
            <div className="mt-8 overflow-x-auto pb-4 md:hidden">
              <div className="flex gap-4 px-4">
                {developers.map((d: any) => <DeveloperCard key={d.handle} dev={d} />)}
              </div>
            </div>
            <div className="marquee-pause mt-8 hidden overflow-hidden md:block">
              <div className="flex w-max animate-marquee gap-4 pl-4 pr-4">
                {[...developers, ...developers].map((d: any, i: number) => <DeveloperCard key={`${d.handle}-${i}`} dev={d} />)}
              </div>
            </div>
          </>
        )}
      </section>

      {/* PROJECT SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-label text-[var(--kola)]">What's being built</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-foreground md:text-4xl">Projects from the community</h2>
          </div>
          <Link to="/projects" className="hidden text-sm font-medium text-foreground hover:text-[var(--kola)] md:inline-flex">
            Browse all →
          </Link>
        </div>
        {projects.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">No projects yet. <Link to="/projects/new" className="text-[var(--kola)] underline">Share the first one →</Link></div>
        ) : (
          <RevealStagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {projects.map((p: any) => (
              <Reveal key={p.slug}><ProjectCard project={p} /></Reveal>
            ))}
          </RevealStagger>
        )}
      </section>

      {/* FOR COMPANIES */}
      <section className="relative overflow-hidden bg-[var(--baobab)] py-20 text-[var(--baobab-foreground)]">
        <div aria-hidden className="absolute inset-0 bg-grid-soft" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-6">
          <div>
            <p className="text-label text-[var(--kola)]">For companies</p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
              The talent you are looking for is already here.
            </h2>
            <p className="mt-4 max-w-md text-base text-[var(--baobab-foreground)]/80">
              Bantabaa is the most direct line to motivated, vetted developers across The Gambia, Senegal, Ghana, Sierra Leone, and Nigeria. Post once, reach the people building the next decade.
            </p>

            <ul className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Verified profiles", body: "Not just resumes." },
                { icon: MessagesSquare, title: "Community reputation", body: "Not just credentials." },
                { icon: Globe2, title: "African context", body: "Not just global assumptions." },
              ].map(({ icon: Icon, title, body }) => (
                <li key={title}>
                  <Icon className="size-5 text-[var(--kola)]" aria-hidden />
                  <p className="mt-2 font-medium">{title}</p>
                  <p className="text-sm text-[var(--baobab-foreground)]/70">{body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link to="/for-companies">
                <Button size="lg" className="h-12 bg-[var(--kola)] px-8 text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
                  Post an Opportunity
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Senior Engineers", "Mid-level Devs", "Junior Talent", "Contract Builders"].map((t) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="font-display text-2xl text-[var(--kola)]">300+</div>
                <p className="mt-1 text-sm text-[var(--baobab-foreground)]/80">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <p className="text-center text-label text-muted-foreground">Backed and supported by</p>
        <div className="mt-6 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-5">
          {["UTG", "Make3 Hub", "Startup Gambia", "GTBoard", "Smart Africa"].map((n) => (
            <div key={n} className="flex h-14 items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground">
              {n}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-3xl px-4 py-24 text-center md:px-6">
        <h2 className="font-display text-3xl font-semibold text-foreground md:text-5xl">
          Ready to find your place under the tree?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Join the waitlist. We'll welcome you in personally.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="you@yourcraft.dev"
            className="flex-1 rounded-md border border-border bg-card px-4 py-3 text-base text-foreground shadow-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30"
          />
          <Button className="h-12 bg-[var(--kola)] px-6 text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            Join Waitlist
          </Button>
        </form>
      </section>
    </>
  );
}
