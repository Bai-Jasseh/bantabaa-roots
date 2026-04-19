import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Bantabaa" },
      { name: "description", content: "Bantabaa means the gathering tree. We're building the professional home for West African developers — warm, rooted, modern." },
      { property: "og:title", content: "About Bantabaa" },
      { property: "og:description", content: "Where West African developers gather, build, and grow together." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <p className="text-label text-[var(--kola)]">About</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
        The tree under which we gather.
      </h1>
      <div className="prose prose-lg mt-10 max-w-none text-foreground/85">
        <p className="text-xl leading-relaxed">
          Bantabaa is the Mandinka word for the great tree at the center of a village — the place where elders teach, neighbors solve problems together, and travelers are welcomed. It is the original gathering place.
        </p>
        <p className="mt-6 leading-relaxed">
          We're building the digital version of that tree for West African developers. Not a job board. Not a GitHub clone. A home — visible, credible, and built with respect for the people who use it.
        </p>
        <h2 className="mt-12 font-display text-2xl font-semibold">What we believe</h2>
        <ul className="mt-4 space-y-3 leading-relaxed">
          <li>· Talented developers in West Africa are invisible on global platforms. We make them visible.</li>
          <li>· The bridge between local talent and real opportunity is missing. We're building it.</li>
          <li>· Building software here can be lonely. Density and connection make people grow faster.</li>
        </ul>
        <h2 className="mt-12 font-display text-2xl font-semibold">Where we are</h2>
        <p className="mt-4 leading-relaxed">
          Starting in The Gambia, growing across Senegal, Ghana, Sierra Leone, and Nigeria. We move at the pace of the community.
        </p>
      </div>

      <div className="mt-12 rounded-3xl border border-[var(--kola)]/30 bg-[var(--kola)]/5 p-8 text-center">
        <h2 className="font-display text-2xl font-semibold">Find your place under the tree.</h2>
        <p className="mt-2 text-muted-foreground">Join the community. Bring your work. Bring yourself.</p>
        <Link to="/onboarding" className="mt-6 inline-block">
          <Button className="h-11 bg-[var(--kola)] px-8 text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            Join Bantabaa
          </Button>
        </Link>
      </div>
    </div>
  );
}
