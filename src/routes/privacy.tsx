import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Bantabaa" },
      { name: "description", content: "How Bantabaa collects, uses, and protects your information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back home</Link>
      <h1 className="mt-4 font-display text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: May 2026</p>

      <div className="prose prose-neutral mt-8 max-w-none space-y-6 text-foreground/90">
        <Section title="What we collect">
          We collect the information you give us when creating a profile (name, handle, email, country, skills, links)
          and the content you publish (projects, discussions, replies, reactions). We also collect basic technical data
          such as device type and timestamps to keep the platform secure and functional.
        </Section>
        <Section title="How we use it">
          To run Bantabaa: showing your profile and work to the community, sending product notifications you opt into,
          fixing bugs, preventing abuse, and improving the experience. We do not sell your personal data.
        </Section>
        <Section title="Authentication">
          We use email + password and Google sign-in. Passwords are stored hashed by our authentication provider.
          You can delete your account at any time from your profile.
        </Section>
        <Section title="Public content">
          Profiles, projects, and discussions are public by default — that is the point of a community. Don't post
          anything you wouldn't want visible to the world.
        </Section>
        <Section title="Cookies">
          We use a small number of essential cookies to keep you signed in and remember your theme preference.
        </Section>
        <Section title="Your rights">
          You can edit your profile, delete your projects and discussions, or delete your entire account at any time.
          Email <a className="text-[var(--kola)] underline" href="mailto:hello@bantabaa.dev">hello@bantabaa.dev</a> for help.
        </Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-2 leading-relaxed">{children}</p>
    </section>
  );
}
