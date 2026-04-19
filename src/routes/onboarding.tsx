import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagPill } from "@/components/TagPill";
import { Avatar } from "@/components/DeveloperCard";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to the Bantabaa — Join" },
      { name: "description", content: "Build your developer profile in 3 minutes. Welcome to the gathering." },
      { property: "og:title", content: "Join Bantabaa" },
      { property: "og:description", content: "Build your developer profile in 3 minutes." },
    ],
  }),
  component: OnboardingPage,
});

const STEPS = ["Account", "Identity", "Skills", "Story", "Open to", "First project", "Welcome"] as const;
const SKILL_OPTIONS = ["TypeScript", "JavaScript", "Python", "Go", "Dart", "PHP", "React", "Next.js", "Flutter", "Vue", "Tailwind", "Node.js", "FastAPI", "Postgres", "Firebase", "AWS", "Docker"];
const OPEN_TO = ["Open to Work", "Open to Freelance", "Open to Collaboration", "Open to Mentoring", "Not currently available"];

function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [story, setStory] = useState("");
  const [openTo, setOpenTo] = useState<string[]>([]);

  const total = STEPS.length;
  const progress = ((step + 1) / total) * 100;

  const next = () => setStep((s) => Math.min(s + 1, total - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const toggle = (arr: string[], setter: (a: string[]) => void, v: string) =>
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col px-4 py-8 md:px-6 md:py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {total}</span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-[var(--kola)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
        {step === 0 && (
          <Step heading="Welcome to the Bantabaa." sub="Let's build your profile. It takes 3 minutes.">
            <div className="space-y-4">
              <Field label="Email"><input type="email" className={inputCls} placeholder="you@yourcraft.dev" /></Field>
              <Field label="Password"><input type="password" className={inputCls} placeholder="Make it strong" /></Field>
              <Field label="Confirm password"><input type="password" className={inputCls} /></Field>
              <div className="relative my-4 flex items-center"><div className="flex-1 border-t border-border" /><span className="px-3 text-xs uppercase text-muted-foreground">or</span><div className="flex-1 border-t border-border" /></div>
              <Button variant="outline" className="h-11 w-full"><Github className="size-4" /> Continue with GitHub</Button>
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step heading="Tell us who you are." sub="The basics that help your community find you.">
            <div className="space-y-4">
              <Field label="Full name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Amina Jallow" /></Field>
              <Field label="Developer title"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full Stack Developer" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Country">
                  <select className={inputCls}><option>The Gambia</option><option>Senegal</option><option>Ghana</option><option>Sierra Leone</option><option>Nigeria</option></select>
                </Field>
                <Field label="City"><input className={inputCls} placeholder="Banjul" /></Field>
              </div>
              <Field label="Languages spoken">
                <div className="flex flex-wrap gap-2">
                  {["English", "Wolof", "Mandinka", "French", "Pulaar", "Krio"].map((l) => (
                    <button key={l} type="button" className="rounded-full border border-border bg-background px-3 py-1.5 text-sm hover:bg-secondary">{l}</button>
                  ))}
                </div>
              </Field>
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step heading="What do you build with?" sub="Tap to add. We'll group them on your profile.">
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((s) => {
                const on = skills.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggle(skills, setSkills, s)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      on
                        ? "bg-[var(--kola)] text-[var(--kola-foreground)]"
                        : "border border-border bg-background text-foreground/80 hover:bg-secondary"
                    }`}
                  >
                    {on && <Check className="mr-1 inline size-3.5" />}{s}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{skills.length} selected</p>
          </Step>
        )}

        {step === 3 && (
          <Step heading="Your story." sub="Write as yourself, not as a CV. The community is listening.">
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={8}
              maxLength={500}
              placeholder="Tell the community who you are, what you build, and what drives you."
              className={`${inputCls} resize-none leading-relaxed`}
            />
            <p className="mt-2 text-right text-xs text-muted-foreground">{story.length}/500</p>
          </Step>
        )}

        {step === 4 && (
          <Step heading="What are you open to?" sub="Pick all that apply. You can change this anytime.">
            <div className="space-y-2">
              {OPEN_TO.map((o) => {
                const on = openTo.includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => toggle(openTo, setOpenTo, o)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                      on
                        ? "border-[var(--kola)] bg-[var(--kola)]/10"
                        : "border-border bg-background hover:bg-secondary"
                    }`}
                  >
                    <span className="font-medium text-foreground">{o}</span>
                    {on && <Check className="size-4 text-[var(--kola)]" />}
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {step === 5 && (
          <Step heading="Add your first project." sub="Optional but encouraged. Skip and add later if you'd like.">
            <div className="space-y-4">
              <Field label="Project name"><input className={inputCls} placeholder="e.g. Tabaski Pay" /></Field>
              <Field label="One-line description"><input className={inputCls} placeholder="What does it do?" /></Field>
              <Field label="Domain">
                <select className={inputCls}><option>Fintech</option><option>Agritech</option><option>Healthtech</option><option>Edtech</option><option>Govtech</option><option>Other</option></select>
              </Field>
              <Field label="Project link (optional)"><input className={inputCls} placeholder="https://" /></Field>
            </div>
          </Step>
        )}

        {step === 6 && (
          <Step heading={`Welcome to the Bantabaa${name ? `, ${name.split(" ")[0]}` : ""}.`} sub="Your seat under the tree is ready.">
            <div className="rounded-2xl border border-border bg-background p-5">
              <div className="flex items-center gap-4">
                <div className="scale-125 origin-left"><Avatar name={name || "You"} hue={30} /></div>
                <div className="ml-4">
                  <div className="font-display text-xl font-semibold">{name || "Your name"}</div>
                  <div className="text-sm text-muted-foreground">{title || "Developer"}</div>
                </div>
              </div>
              {skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.slice(0, 5).map((s) => <TagPill key={s}>{s}</TagPill>)}
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link to="/profile/$handle" params={{ handle: "amina-jallow" }} className="flex-1">
                <Button className="h-11 w-full bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">View your profile</Button>
              </Link>
              <Link to="/projects" className="flex-1">
                <Button variant="outline" className="h-11 w-full">Explore the community</Button>
              </Link>
            </div>
          </Step>
        )}
      </div>

      {/* Nav */}
      {step < total - 1 && (
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          <p className="hidden text-xs text-muted-foreground sm:block">
            {step === 5 ? "You can skip this step" : "Almost there. The community is waiting for you."}
          </p>
          <Button onClick={next} className="bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            {step === 5 ? "Skip & finish" : "Continue"} <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kola)] focus:outline-none focus:ring-2 focus:ring-[var(--kola)]/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function Step({ heading, sub, children }: { heading: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{heading}</h1>
      <p className="mt-2 text-muted-foreground">{sub}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}
