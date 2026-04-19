import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUp, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/DeveloperCard";
import { SAMPLE_SPACES } from "@/data/sample";

export const Route = createFileRoute("/spaces/$slug")({
  loader: ({ params }) => {
    const space = SAMPLE_SPACES.find((s) => s.slug === params.slug);
    if (!space) throw notFound();
    return { space };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.space.name} — Spaces — Bantabaa` },
      { name: "description", content: loaderData?.space.blurb ?? "" },
      { property: "og:title", content: `${loaderData?.space.name} on Bantabaa` },
      { property: "og:description", content: loaderData?.space.blurb ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-32 text-center">
      <h1 className="font-display text-3xl">Space not found</h1>
      <Link to="/spaces" className="mt-4 inline-block text-[var(--kola)]">← All spaces</Link>
    </div>
  ),
  component: SpaceDetailPage,
});

const SAMPLE_THREADS = [
  { id: "1", title: "What's the right way to handle XOF currency in Postgres?", author: "Fatou Ndiaye", hue: 145, replies: 12, upvotes: 28, time: "2h" },
  { id: "2", title: "Anyone deployed Flutter to low-end Android in Banjul? Tips?", author: "Lamin Ceesay", hue: 60, replies: 7, upvotes: 19, time: "5h" },
  { id: "3", title: "Open Source: looking for help translating to Wolof", author: "Isatou Bah", hue: 25, replies: 4, upvotes: 33, time: "1d" },
  { id: "4", title: "How are you handling auth for a USSD-first product?", author: "Amina Jallow", hue: 30, replies: 9, upvotes: 14, time: "2d" },
];

function SpaceDetailPage() {
  const { space } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
      <Link to="/spaces" className="text-sm text-muted-foreground hover:text-foreground">← All spaces</Link>
      <div className="mt-6 flex items-center gap-4">
        <div className="text-5xl">{space.emoji}</div>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{space.name}</h1>
          <p className="text-muted-foreground">{space.blurb} · {space.members.toLocaleString()} members</p>
        </div>
      </div>

      {/* Composer */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <input
          placeholder="Start a discussion under the tree…"
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30"
        />
        <div className="mt-3 flex justify-between">
          <div className="flex gap-2 text-xs">
            {["Question", "Resource", "Show & tell"].map((t) => (
              <button key={t} className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground hover:bg-secondary">{t}</button>
            ))}
          </div>
          <Button className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">Share</Button>
        </div>
      </div>

      {/* Thread list */}
      <div className="mt-8 space-y-3">
        {SAMPLE_THREADS.map((t) => (
          <article key={t.id} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-warm">
            <div className="flex flex-col items-center gap-1">
              <button className="flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:border-[var(--kola)] hover:text-[var(--kola)]">
                <ArrowUp className="size-4" />
              </button>
              <span className="text-xs font-semibold tabular-nums">{t.upvotes}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-semibold leading-tight text-foreground hover:text-[var(--kola)]">{t.title}</h3>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="scale-50 origin-left"><Avatar name={t.author} hue={t.hue} /></span>
                  <span className="-ml-3">{t.author}</span>
                </span>
                <span>· {t.time} ago</span>
                <span className="inline-flex items-center gap-1"><MessageCircle className="size-3.5" /> {t.replies} replies</span>
              </div>
            </div>
            <button className="self-start text-muted-foreground hover:text-foreground" aria-label="Bookmark">
              <Bookmark className="size-4" />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
