import type { Developer } from "@/components/DeveloperCard";
import type { Project, Domain } from "@/components/ProjectCard";
import type { Opportunity } from "@/components/OpportunityCard";

export const SAMPLE_DEVELOPERS: Developer[] = [
  { handle: "amina-jallow", name: "Amina Jallow", title: "Full Stack Developer", location: "Banjul, Gambia", flag: "🇬🇲", skills: ["TypeScript", "React", "Node.js", "PostgreSQL"], openTo: "Work", avatarHue: 30 },
  { handle: "lamin-ceesay", name: "Lamin Ceesay", title: "Mobile Developer", location: "Serrekunda, Gambia", flag: "🇬🇲", skills: ["Flutter", "Dart", "Firebase"], openTo: "Freelance", avatarHue: 60 },
  { handle: "fatou-ndiaye", name: "Fatou Ndiaye", title: "Data Engineer", location: "Dakar, Senegal", flag: "🇸🇳", skills: ["Python", "Airflow", "BigQuery"], openTo: "Collaboration", avatarHue: 145 },
  { handle: "kwame-asare", name: "Kwame Asare", title: "DevOps Engineer", location: "Accra, Ghana", flag: "🇬🇭", skills: ["AWS", "Terraform", "Kubernetes"], openTo: "Mentoring", avatarHue: 250 },
  { handle: "isatou-bah", name: "Isatou Bah", title: "Product Designer & Front-end", location: "Brikama, Gambia", flag: "🇬🇲", skills: ["Figma", "React", "Tailwind"], openTo: "Work", avatarHue: 25 },
  { handle: "ibrahim-koroma", name: "Ibrahim Koroma", title: "Backend Engineer", location: "Freetown, Sierra Leone", flag: "🇸🇱", skills: ["Go", "gRPC", "Postgres"], openTo: "Freelance", avatarHue: 290 },
];

export const SAMPLE_PROJECTS: Project[] = [
  {
    slug: "tabaski-pay",
    name: "Tabaski Pay",
    description: "Mobile money rails for community savings circles (osusu) across The Gambia and Senegal.",
    domain: "Fintech",
    builder: { name: "Amina Jallow", handle: "amina-jallow", hue: 30 },
    stack: ["React Native", "Node.js", "PostgreSQL"],
    appreciate: 142, discuss: 28,
  },
  {
    slug: "agribaa",
    name: "Agribaa",
    description: "SMS-first crop price tracker for groundnut and rice farmers, with offline support.",
    domain: "Agritech",
    builder: { name: "Fatou Ndiaye", handle: "fatou-ndiaye", hue: 145 },
    stack: ["Twilio", "Python", "FastAPI"],
    appreciate: 89, discuss: 14,
  },
  {
    slug: "kaira-health",
    name: "Kaira Health",
    description: "Tele-consultation booking for rural clinics, optimized for low-bandwidth networks.",
    domain: "Healthtech",
    builder: { name: "Lamin Ceesay", handle: "lamin-ceesay", hue: 60 },
    stack: ["Flutter", "Firebase", "WebRTC"],
    appreciate: 67, discuss: 9,
  },
  {
    slug: "karanta",
    name: "Karanta",
    description: "Wolof and Mandinka language learning app with audio from native speakers.",
    domain: "Edtech",
    builder: { name: "Isatou Bah", handle: "isatou-bah", hue: 25 },
    stack: ["React", "Supabase", "TypeScript"],
    appreciate: 201, discuss: 42,
  },
  {
    slug: "openbantaba",
    name: "OpenBantaba",
    description: "Open data portal for The Gambia government services and procurement notices.",
    domain: "Govtech",
    builder: { name: "Kwame Asare", handle: "kwame-asare", hue: 250 },
    stack: ["Next.js", "Postgres", "Prisma"],
    appreciate: 54, discuss: 11,
  },
  {
    slug: "djembe-ui",
    name: "Djembe UI",
    description: "A warm, rooted React component library inspired by West African textile patterns.",
    domain: "Other",
    builder: { name: "Ibrahim Koroma", handle: "ibrahim-koroma", hue: 290 },
    stack: ["React", "Tailwind", "Storybook"],
    appreciate: 98, discuss: 17,
  },
];

export const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  { id: "senior-fullstack-paystack", title: "Senior Full Stack Engineer", company: "Paystack", type: "Job", location: "Lagos / Remote", locationType: "Remote", tags: ["TypeScript", "React", "Node.js", "Postgres"], compensation: "$60k–90k", postedDays: 2, logoHue: 250 },
  { id: "mobile-flutter-jumia", title: "Mobile Engineer (Flutter)", company: "Jumia", type: "Job", location: "Dakar", locationType: "Hybrid", tags: ["Flutter", "Dart", "REST"], compensation: "Competitive", postedDays: 5, logoHue: 25 },
  { id: "contract-frontend-3mo", title: "3-month Front-end Contract", company: "GreenLeaf NGO", type: "Contract", location: "Remote", locationType: "Remote", tags: ["React", "Tailwind", "Accessibility"], compensation: "$8k fixed", postedDays: 1, logoHue: 145 },
  { id: "tony-elumelu-grant", title: "Tony Elumelu Foundation Grant", company: "TEF", type: "Grant", location: "Pan-African", locationType: "Remote", tags: ["Founders", "Seed", "Africa"], compensation: "$5,000", postedDays: 12, logoHue: 60 },
  { id: "mentor-juniors-banjul", title: "Mentor 3 Junior Devs in Banjul", company: "Bantabaa Community", type: "Mentorship", location: "Banjul", locationType: "Hybrid", tags: ["JavaScript", "Career"], compensation: "Volunteer", postedDays: 3, logoHue: 30 },
];

export const DOMAINS: Domain[] = ["Fintech", "Agritech", "Healthtech", "Edtech", "Govtech", "Other"];

export const SAMPLE_SPACES = [
  { slug: "web-development", name: "Web Development", category: "Domain", members: 1284, blurb: "Front-end, back-end, the whole tree.", emoji: "🌐" },
  { slug: "mobile", name: "Mobile", category: "Domain", members: 742, blurb: "iOS, Android, Flutter, React Native.", emoji: "📱" },
  { slug: "data-ai", name: "Data & AI", category: "Domain", members: 511, blurb: "From notebooks to production models.", emoji: "🧠" },
  { slug: "cybersecurity", name: "Cybersecurity", category: "Domain", members: 198, blurb: "Defenders of the digital savanna.", emoji: "🛡️" },
  { slug: "open-source", name: "Open Source", category: "Domain", members: 433, blurb: "Building in public, together.", emoji: "🌱" },
  { slug: "beginners-corner", name: "Beginners Corner", category: "Stage", members: 2106, blurb: "No question is too small here.", emoji: "🌱" },
  { slug: "career-growth", name: "Career Growth", category: "Stage", members: 1340, blurb: "Interviews, salaries, the next step.", emoji: "🪜" },
  { slug: "senior-lounge", name: "Senior Lounge", category: "Stage", members: 287, blurb: "Architecture, leadership, scale.", emoji: "🪑" },
  { slug: "the-gambia", name: "The Gambia", category: "Country", members: 612, blurb: "Banjul, Serrekunda, Brikama and beyond.", emoji: "🇬🇲" },
  { slug: "senegal", name: "Senegal", category: "Country", members: 489, blurb: "Dakar to Saint-Louis.", emoji: "🇸🇳" },
  { slug: "ghana", name: "Ghana", category: "Country", members: 0, blurb: "Coming soon — bring your people.", emoji: "🇬🇭", comingSoon: true },
  { slug: "nigeria", name: "Nigeria", category: "Country", members: 0, blurb: "Coming soon — bring your people.", emoji: "🇳🇬", comingSoon: true },
];
