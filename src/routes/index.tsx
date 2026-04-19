import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Compass, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeveloperCard } from "@/components/DeveloperCard";
import { ProjectCard } from "@/components/ProjectCard";
import { TagPill } from "@/components/TagPill";
import { SAMPLE_DEVELOPERS, SAMPLE_PROJECTS } from "@/data/sample";
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
  component: LandingPage,
});

const LOCATIONS = ["Banjul", "Serrekunda", "Brikama", "Dakar", "Saint-Louis", "Accra", "Kumasi", "Freetown", "Lagos", "Abuja"];

function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-baobab-pattern"
          aria-hidden
        />
        <img
          src={heroBaobab}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-2/3 select-none object-cover object-right opacity-30 mix-blend-multiply md:block dark:opacity-15"
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-20 md:grid-cols-12 md:px-6 md:py-32">
          <div className="md:col-span-7">
            <TagPill className="mb-6">🌳 A gathering place for West African developers</TagPill>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Where Gambian<br />developers <em className="not-italic text-[var(--kola)]">gather.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Bantabaa is the professional home for West African developers — build your identity, showcase your work, and find your opportunity.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
            </div>
          </div>
        </div>

        {/* LOCATIONS MARQUEE */}
        <div className="relative border-y border-border bg-card/50 py-4">
          <div className="flex overflow-hidden">
            <div className="flex shrink-0 animate-marquee gap-10 whitespace-nowrap pr-10 text-sm text-muted-foreground">
              {[...LOCATIONS, ...LOCATIONS].map((c, i) => (
                <span key={i} className="inline-flex items-center gap-3">
                  <span className="size-1 rounded-full bg-[var(--kola)]" />
                  Built by developers in <span className="font-medium text-foreground">{c}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "Be Visible", body: "Your work, your skills, and your story — seen by the people who matter." },
            { icon: Compass, title: "Find Opportunity", body: "Jobs, contracts, grants, and mentorship — all in one place built for you." },
            { icon: Users2, title: "Grow Together", body: "A community that understands your context, your challenges, and your ambition." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-8 shadow-soft">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--kola)]/15 text-[var(--kola)]">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEVELOPER SHOWCASE */}
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
        <div className="mt-8 overflow-x-auto pb-4">
          <div className="mx-auto flex max-w-[1400px] gap-4 px-4 md:px-6">
            {SAMPLE_DEVELOPERS.map((d) => (
              <DeveloperCard key={d.handle} dev={d} />
            ))}
          </div>
        </div>
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
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_PROJECTS.slice(0, 3).map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* FOR COMPANIES */}
      <section className="bg-[var(--baobab)] py-20 text-[var(--baobab-foreground)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-6">
          <div>
            <p className="text-label text-[var(--kola)]">For companies</p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
              Find exceptional African developer talent.
            </h2>
            <p className="mt-4 max-w-md text-base text-[var(--baobab-foreground)]/80">
              Bantabaa is the most direct line to motivated, vetted developers across The Gambia, Senegal, Ghana, Sierra Leone, and Nigeria. Post once, reach the people building the next decade.
            </p>
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
