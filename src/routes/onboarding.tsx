import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft, ArrowRight, Check, Github, Eye, EyeOff,
  Briefcase, Zap, Users, Heart,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
const STEP_MINUTES = [3, 2, 2, 1, 1, 1, 0];

const SKILL_GROUPS = {
  Languages: ["JavaScript", "TypeScript", "Python", "PHP", "Java", "Kotlin", "Swift", "Dart", "Go", "Rust", "C++", "C#", "Ruby", "SQL", "HTML", "CSS"],
  "Frameworks & Libraries": ["React", "Next.js", "Vue", "Angular", "Node.js", "Express", "Django", "Laravel", "FastAPI", "Flutter", "React Native", "Spring Boot", "TailwindCSS"],
  "Tools & Platforms": ["Git", "GitHub", "Docker", "Linux", "AWS", "Firebase", "Supabase", "Figma", "PostgreSQL", "MongoDB", "MySQL", "Redis", "Vercel", "Netlify"],
  Domains: ["Fintech", "Agritech", "Healthtech", "Edtech", "Govtech", "E-commerce", "Open Source", "Mobile", "AI/ML", "Cybersecurity", "Blockchain"],
};

const TITLE_SUGGESTIONS = [
  "Full Stack Developer", "Frontend Developer", "Backend Developer", "Mobile Developer",
  "Data Engineer", "ML Engineer", "DevOps Engineer", "UI/UX Designer", "Software Engineer",
];

const COUNTRIES = ["Gambia", "Senegal", "Ghana", "Nigeria", "Sierra Leone", "Liberia", "Mali", "Guinea", "Côte d'Ivoire", "Cape Verde", "Mauritania", "Other"];
const LANGUAGES = ["English", "French", "Wolof", "Mandinka", "Pulaar", "Serer", "Diola", "Arabic", "Hausa", "Yoruba", "Igbo", "Twi", "Portuguese"];

const OPEN_TO_OPTIONS = [
  { key: "work", icon: Briefcase, label: "Open to Work", desc: "I am looking for a full-time role. Companies can reach out." },
  { key: "freelance", icon: Zap, label: "Open to Freelance", desc: "I am available for contract and freelance projects." },
  { key: "collab", icon: Users, label: "Open to Collaboration", desc: "I want to build things with other developers." },
  { key: "mentor", icon: Heart, label: "Open to Mentoring", desc: "I am willing to give my time to help developers earlier in their journey." },
];

function OnboardingPage() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showPwd, setShowPwd] = useState(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("Gambia");
  const [city, setCity] = useState("");
  const [langs, setLangs] = useState<string[]>(["English"]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [story, setStory] = useState("");
  const [openTo, setOpenTo] = useState<string[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");

  const total = STEPS.length;
  const next = () => { setDirection(1); setStep((s) => Math.min(s + 1, total - 1)); };
  const prev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };
  const toggle = <T,>(arr: T[], setter: (a: T[]) => void, v: T) =>
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const minutesLeft = STEP_MINUTES.slice(step + 1).reduce((a, b) => a + b, 0);
  const completion = Math.min(100, Math.round(
    (Number(!!name) * 15 + Number(!!title) * 15 + Number(skills.length > 0) * 20 +
      Number(!!story) * 20 + Number(openTo.length > 0 || unavailable) * 15 + 15)
  ));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-warm">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl md:grid-cols-[40%_1fr]">
        {/* Illustration panel — desktop */}
        <aside className="hidden bg-cover-baobab-kola md:flex md:items-center md:justify-center md:p-10">
          <div className="relative aspect-square w-full max-w-sm">
            <BaobabIllustration step={step} reduce={!!reduce} />
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex flex-col px-4 py-6 md:px-12 md:py-10">
          {/* Progress dots */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              {STEPS.map((_, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center rounded-full transition-all ${
                      active ? "size-3 bg-[var(--kola)]" :
                      done ? "size-2.5 bg-[var(--kola)]" :
                      "size-2 border border-border bg-transparent"
                    }`}
                  >
                    {done && <Check className="size-1.5 text-[var(--kola-foreground)]" strokeWidth={4} />}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Step {step + 1} of {total}{minutesLeft > 0 && ` · ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"} left`}
            </p>
          </div>

          {/* Back button */}
          {step > 0 && step < total - 1 && (
            <button onClick={prev} className="-mt-2 mb-2 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              <ArrowLeft className="size-4" /> Back
            </button>
          )}

          {/* Step content */}
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={reduce ? false : { opacity: 0, x: direction * 24 }}
                animate={reduce ? undefined : { opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {step === 0 && (
                  <Step heading="Welcome to Bantabaa." sub="The professional home for West African developers. Let's get you started — it takes about 3 minutes.">
                    <div className="space-y-3">
                      <Button variant="outline" className="h-11 w-full bg-foreground text-background hover:bg-foreground/90 hover:text-background">
                        <Github className="size-4" /> Continue with GitHub
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">Most developers use this</p>
                      <Button variant="outline" className="h-11 w-full">Continue with Google</Button>
                      <div className="relative my-4 flex items-center">
                        <div className="flex-1 border-t border-border" />
                        <span className="px-3 text-xs uppercase tracking-wider text-muted-foreground">or sign up with email</span>
                        <div className="flex-1 border-t border-border" />
                      </div>
                      <Field label="Email address"><input type="email" className={inputCls} placeholder="you@example.com" /></Field>
                      <Field label="Password">
                        <div className="relative">
                          <input type={showPwd ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} className={inputCls} placeholder="At least 8 characters" />
                          <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                            {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </Field>
                      <Field label="Confirm password">
                        <div className="relative">
                          <input type={showPwd ? "text" : "password"} value={pwd2} onChange={(e) => setPwd2(e.target.value)} className={inputCls} />
                          {pwd2.length > 0 && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                              {pwd2 === pwd ? <Check className="size-4 text-[var(--savanna)]" /> : <span className="text-[var(--destructive)]">×</span>}
                            </span>
                          )}
                        </div>
                      </Field>
                      <p className="pt-2 text-xs text-muted-foreground">By joining you agree to our <a className="text-[var(--kola)] underline">Terms</a> and <a className="text-[var(--kola)] underline">Privacy Policy</a>.</p>
                    </div>
                  </Step>
                )}

                {step === 1 && (
                  <Step heading="Tell us who you are." sub="This is how the community will know you. Be yourself.">
                    <div className="space-y-4">
                      <Field label="Your full name" hint="This is public on your profile.">
                        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="How you want to be known" />
                      </Field>
                      <Field label="What do you call yourself?">
                        <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full Stack Developer" list="title-suggestions" />
                        <datalist id="title-suggestions">
                          {TITLE_SUGGESTIONS.map((t) => <option key={t} value={t} />)}
                        </datalist>
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Country">
                          <select className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)}>
                            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                          </select>
                        </Field>
                        <Field label="Your city">
                          <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Banjul, Serrekunda…" />
                        </Field>
                      </div>
                      <Field label="Languages you speak" hint="Include local languages — they matter here.">
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map((l) => {
                            const on = langs.includes(l);
                            return (
                              <button key={l} type="button" onClick={() => toggle(langs, setLangs, l)}
                                className={`rounded-full px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                                  on ? "bg-[var(--kola)] text-[var(--kola-foreground)]" : "border border-border bg-background hover:bg-secondary"
                                }`}>{l}</button>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </Step>
                )}

                {step === 2 && (
                  <Step heading="What do you build with?" sub="Select the skills that represent your toolkit. You can update these anytime.">
                    <input
                      type="search" value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)}
                      placeholder="Search skills…" className={`${inputCls} mb-4`}
                    />
                    <div className="space-y-5">
                      {Object.entries(SKILL_GROUPS).map(([group, items]) => {
                        const visible = items.filter((s) => s.toLowerCase().includes(skillSearch.toLowerCase()));
                        if (visible.length === 0) return null;
                        const selected = items.filter((s) => skills.includes(s)).length;
                        return (
                          <div key={group}>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="section-label">{group}</span>
                              {selected > 0 && <span className="text-xs text-[var(--kola)]">{selected} selected</span>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {visible.map((s) => {
                                const on = skills.includes(s);
                                return (
                                  <button key={s} type="button" onClick={() => toggle(skills, setSkills, s)}
                                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all cursor-pointer ${
                                      on
                                        ? "border border-[var(--kola)] bg-[color-mix(in_oklab,var(--kola)_15%,transparent)] text-[var(--kola)]"
                                        : "border border-border bg-background text-foreground/80 hover:bg-secondary"
                                    }`}>
                                    {on && <Check className="mr-1 inline size-3.5" />}{s}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Step>
                )}

                {step === 3 && (
                  <Step heading="Tell your story." sub="The most human part of your profile. Write as yourself — not as a CV.">
                    <textarea
                      value={story} onChange={(e) => setStory(e.target.value)} rows={8}
                      placeholder="I am a developer from [city] who builds [what you build] because [why it matters to you]. I got into tech by [your story]. Right now I am excited about [current focus]…"
                      className={`${inputCls} resize-none italic leading-relaxed placeholder:italic`}
                    />
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-muted-foreground italic">
                        {story.length === 0 ? "" :
                         story.length < 50 ? "Keep going…" :
                         story.length < 150 ? "That's a great start." :
                         story.length < 300 ? "The community will love this." :
                         "Beautifully written."}
                      </span>
                      <span className={story.length > 50 ? "text-[var(--kola)]" : "text-muted-foreground"}>{story.length}</span>
                    </div>
                  </Step>
                )}

                {step === 4 && (
                  <Step heading="What are you open to?" sub="Let the community and companies know how they can connect with you.">
                    <div className="space-y-3">
                      {OPEN_TO_OPTIONS.map((o) => {
                        const on = openTo.includes(o.key);
                        const Icon = o.icon;
                        return (
                          <button
                            key={o.key} type="button"
                            onClick={() => { setUnavailable(false); toggle(openTo, setOpenTo, o.key); }}
                            className={`flex w-full items-start gap-4 rounded-2xl border-l-4 p-4 text-left transition-all cursor-pointer ${
                              on
                                ? "border-l-[var(--kola)] border-y border-r border-y-[var(--kola)]/30 border-r-[var(--kola)]/30 bg-[color-mix(in_oklab,var(--kola)_6%,var(--card))]"
                                : "border border-border bg-background hover:bg-secondary"
                            }`}>
                            <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${on ? "bg-[var(--kola)] text-[var(--kola-foreground)]" : "bg-[color-mix(in_oklab,var(--kola)_15%,transparent)] text-[var(--kola)]"}`}>
                              <Icon className="size-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-display font-semibold">{o.label}</div>
                              <div className="mt-1 text-sm text-muted-foreground">{o.desc}</div>
                            </div>
                            <div className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${on ? "border-[var(--kola)] bg-[var(--kola)]" : "border-border"}`}>
                              {on && <Check className="size-3 text-[var(--kola-foreground)]" />}
                            </div>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => { setUnavailable(true); setOpenTo([]); }}
                        className={`block w-full pt-3 text-center text-sm cursor-pointer ${unavailable ? "text-[var(--kola)]" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        I am not currently available.
                      </button>
                    </div>
                  </Step>
                )}

                {step === 5 && (
                  <Step heading="Show us what you have built." sub="Optional but encouraged. It does not have to be finished. Just something you are proud of.">
                    <div className="space-y-4">
                      <Field label="What is it called?"><input className={inputCls} placeholder="My project name" /></Field>
                      <Field label="What does it do?"><input className={inputCls} placeholder="One sentence that explains it." maxLength={120} /></Field>
                      <Field label="Domain">
                        <div className="flex flex-wrap gap-2">
                          {["Fintech", "Agritech", "Healthtech", "Edtech", "Govtech", "Open Source", "Other"].map((d) => (
                            <button key={d} type="button" className="rounded-full border border-border bg-background px-3 py-1.5 text-sm hover:bg-secondary cursor-pointer">{d}</button>
                          ))}
                        </div>
                      </Field>
                      <Field label="Project stage">
                        <div className="flex gap-2">
                          {["Idea", "In Progress", "Launched"].map((s) => (
                            <button key={s} type="button" className="flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-sm hover:bg-secondary cursor-pointer">{s}</button>
                          ))}
                        </div>
                      </Field>
                      <Field label="Project link (optional)"><input className={inputCls} placeholder="https://" /></Field>
                    </div>
                  </Step>
                )}

                {step === 6 && (
                  <WelcomeStep name={name} title={title} skills={skills} completion={completion} reduce={!!reduce} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav */}
          {step < total - 1 && (
            <div className="mt-6 flex items-center justify-between gap-3">
              {step === 3 || step === 5 ? (
                <button onClick={next} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Skip for now</button>
              ) : <span />}
              <Button
                onClick={next}
                disabled={step === 2 && skills.length === 0}
                className="ml-auto bg-[var(--kola)] text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90 disabled:opacity-50"
              >
                {step === 0 ? "Create My Account" :
                 step === 1 ? "That's me. Continue." :
                 step === 2 ? "These are my skills." :
                 step === 3 ? (story ? "This is my story." : "Skip for now") :
                 step === 4 ? "This is what I want." :
                 "Add this project."} <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function WelcomeStep({ name, title, skills, completion, reduce }: { name: string; title: string; skills: string[]; completion: number; reduce: boolean }) {
  const firstName = name.split(" ")[0] || "friend";
  const colors = ["#3D2314", "#D48B2D", "#4A7C59", "#FAF6F0"];
  const pieces = useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      color: colors[i % colors.length],
      duration: 1.8 + Math.random() * 1.2,
    })),
    [],
  );

  const encouragement =
    completion < 50 ? "Add more to be discovered by the community." :
    completion < 80 ? "Almost there. A complete profile gets 3× more views." :
    "Your profile is looking great.";

  return (
    <div className="relative">
      {!reduce && (
        <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
          {pieces.map((p, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                left: `${p.left}%`,
                top: "-20px",
                background: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
        Welcome to the Bantabaa, <span className="text-[var(--kola)]">{firstName}</span>.
      </h1>
      <p className="mt-3 text-base leading-[1.7] text-muted-foreground md:text-lg">
        You are now part of something being built from the ground up — a professional home for West African developers. The tree is yours.
      </p>

      <motion.div
        initial={reduce ? false : { scale: 0.95, opacity: 0 }}
        animate={reduce ? undefined : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="mt-6 rounded-2xl border-2 border-[var(--kola)] bg-card p-5 shadow-warm"
      >
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
      </motion.div>

      {/* Completion */}
      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="relative size-14 shrink-0">
          <svg viewBox="0 0 36 36" className="size-14 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--kola)" strokeWidth="3"
              strokeDasharray={`${completion} 100`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{completion}%</span>
        </div>
        <div>
          <div className="font-display font-semibold">Your profile is {completion}% complete.</div>
          <div className="text-sm text-muted-foreground">{encouragement}</div>
        </div>
      </div>

      {/* What's next */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { to: "/projects", label: "Explore the Community" },
          { to: "/opportunities", label: "Browse Opportunities" },
          { to: "/spaces", label: "Find Your Space" },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="group flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm font-medium transition-colors hover:border-[var(--kola)]">
            {c.label}
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[var(--kola)]" />
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <Link to="/profile/$handle" params={{ handle: "amina-jallow" }}>
          <Button className="h-12 w-full bg-[var(--kola)] text-base text-[var(--kola-foreground)] hover:bg-[var(--kola)]/90">
            View My Profile
          </Button>
        </Link>
        <Link to="/projects" className="block text-center text-sm text-muted-foreground hover:text-foreground">
          Or explore the community first
        </Link>
      </div>
    </div>
  );
}

function BaobabIllustration({ step, reduce }: { step: number; reduce: boolean }) {
  // Subtle figure count grows with steps, suggesting community gathering
  const figures = Math.min(2 + step, 8);
  return (
    <div className={`relative h-full w-full ${reduce ? "" : "animate-breathe"}`}>
      <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
        {/* Sky */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D48B2D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3D2314" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="400" height="400" fill="url(#sky)" opacity="0.5" />
        {/* Ground */}
        <ellipse cx="200" cy="370" rx="180" ry="20" fill="#1A1210" opacity="0.3" />
        {/* Baobab trunk */}
        <path d="M180 370 Q175 280 185 220 Q170 180 195 160 Q220 180 215 220 Q225 280 220 370 Z"
          fill="#FAF6F0" opacity="0.95" />
        {/* Baobab canopy */}
        <circle cx="200" cy="120" r="80" fill="#FAF6F0" opacity="0.95" />
        <circle cx="150" cy="135" r="45" fill="#FAF6F0" opacity="0.95" />
        <circle cx="250" cy="135" r="45" fill="#FAF6F0" opacity="0.95" />
        {/* Branches */}
        <path d="M200 200 L160 130 M200 200 L240 130 M200 200 L200 110" stroke="#FAF6F0" strokeWidth="3" opacity="0.7" />
        {/* Figures gathering */}
        {Array.from({ length: figures }).map((_, i) => {
          const angle = (i / figures) * Math.PI - Math.PI / 2;
          const x = 200 + Math.cos(angle) * 140;
          const y = 350 + Math.sin(angle) * 18;
          return (
            <g key={i}>
              <circle cx={x} cy={y - 14} r="6" fill="#FAF6F0" opacity="0.9" />
              <rect x={x - 5} y={y - 8} width="10" height="16" rx="3" fill="#FAF6F0" opacity="0.9" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-[var(--kola)] focus:outline-none focus:ring-[3px] focus:ring-[var(--kola)]/15";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Step({ heading, sub, children }: { heading: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{heading}</h1>
      <p className="mt-2 text-muted-foreground">{sub}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
