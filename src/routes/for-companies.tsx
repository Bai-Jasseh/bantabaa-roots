import { createFileRoute } from "@tanstack/react-router";
import { Building2, Briefcase, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/for-companies")({
  head: () => ({
    meta: [
      { title: "For companies — Bantabaa" },
      { name: "description", content: "Hire exceptional African developer talent. Post jobs, contracts, and grants on Bantabaa and reach motivated developers across West Africa." },
      { property: "og:title", content: "For Companies — Bantabaa" },
      { property: "og:description", content: "Hire exceptional African developer talent." },
    ],
  }),
  component: ForCompaniesPage,
});

function ForCompaniesPage() {
  return (
    <div>
      <section className="bg-[var(--baobab)] py-20 text-[var(--baobab-foreground)] md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <p className="text-label text-[var(--kola)]">For companies</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-6xl">
            Find exceptional African<br />developer talent.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--baobab-foreground)]/80">
            Bantabaa is the most direct line to motivated, vetted developers across The Gambia, Senegal, Ghana, Sierra Leone, and Nigeria.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="h-12 bg-[var(--kola)] px-8 text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
              Post an opportunity
            </Button>
            <Button size="lg" variant="outline" className="h-12 border-white/20 bg-transparent px-8 text-[var(--baobab-foreground)] hover:bg-white/10">
              Talk to us
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Users, title: "1,200+ developers", body: "Verified profiles with real projects, real stacks, and real availability signals." },
            { icon: Briefcase, title: "All shapes of hiring", body: "Full-time, contract, fellowship, mentorship — post the role that actually fits." },
            { icon: Sparkles, title: "Native context", body: "We understand the culture. Our community moderation keeps quality high." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-8">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--savanna)]/15 text-[var(--savanna)]">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-2 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 md:px-6">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--kola)]/15 text-[var(--kola)]">
              <Building2 className="size-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">Post an opportunity</h2>
              <p className="mt-1 text-muted-foreground">Tell us about the role. We'll get it in front of the right developers within 48 hours.</p>
            </div>
          </div>
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
            <Input label="Company" placeholder="Your company" />
            <Input label="Your name" placeholder="Hiring lead" />
            <Input label="Work email" placeholder="you@company.com" type="email" />
            <Input label="Role title" placeholder="e.g. Senior Backend Engineer" />
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">About the role</label>
              <textarea rows={5} className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30" placeholder="What problem is this person solving? What stack? Comp range?" />
            </div>
            <div className="sm:col-span-2">
              <Button className="h-11 w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90 sm:w-auto">
                Submit opportunity
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        {...props}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30"
      />
    </label>
  );
}
