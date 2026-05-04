import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Bantabaa" },
      { name: "description", content: "The rules of the gathering. How we expect everyone to behave on Bantabaa." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back home</Link>
      <h1 className="mt-4 font-display text-4xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: May 2026</p>

      <div className="mt-8 space-y-6 text-foreground/90">
        <Section title="Welcome under the tree">
          By using Bantabaa you agree to be a good neighbour. Be honest about who you are. Respect other developers,
          their work, and their time. We are a community first, a platform second.
        </Section>
        <Section title="Your account">
          You are responsible for what you post and for keeping your password safe. One person, one account.
          Companies post under their own brand.
        </Section>
        <Section title="Your content">
          You keep ownership of everything you publish. You give us a non-exclusive licence to display it on Bantabaa,
          our social channels, and the search engines that index us.
        </Section>
        <Section title="What is not allowed">
          Spam, harassment, hate speech, scams, plagiarism, off-topic promotion, illegal content, or anything that
          puts other developers at risk. We may remove content and accounts that break these rules.
        </Section>
        <Section title="Opportunities">
          If you post a job, contract, grant, or mentorship slot, it must be real. Misleading or discriminatory
          listings will be removed and the poster banned.
        </Section>
        <Section title="No warranty">
          Bantabaa is provided as-is. We work hard to keep it running, but we cannot guarantee uninterrupted service
          or that every opportunity posted leads to work.
        </Section>
        <Section title="Changes">
          We may update these terms. We'll let the community know before any meaningful change.
        </Section>
        <Section title="Contact">
          Questions? <a className="text-[var(--kola)] underline" href="mailto:hello@bantabaa.dev">hello@bantabaa.dev</a>
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
