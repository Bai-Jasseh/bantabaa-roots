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
    builder: { name: "Amina Jallow", handle: "amina-jallow", hue: 30, location: "Banjul, Gambia", flag: "🇬🇲" },
    stack: ["React Native", "Node.js", "PostgreSQL", "Stripe"],
    appreciate: 142, discuss: 28, year: 2025, postedDays: 1, seekingCollab: true, featured: true,
  },
  {
    slug: "agribaa",
    name: "Agribaa",
    description: "SMS-first crop price tracker for groundnut and rice farmers, with offline support.",
    domain: "Agritech",
    builder: { name: "Fatou Ndiaye", handle: "fatou-ndiaye", hue: 145, location: "Dakar, Senegal", flag: "🇸🇳" },
    stack: ["Twilio", "Python", "FastAPI"],
    appreciate: 89, discuss: 14, year: 2025, postedDays: 4,
  },
  {
    slug: "kaira-health",
    name: "Kaira Health",
    description: "Tele-consultation booking for rural clinics, optimized for low-bandwidth networks.",
    domain: "Healthtech",
    builder: { name: "Lamin Ceesay", handle: "lamin-ceesay", hue: 60, location: "Serrekunda, Gambia", flag: "🇬🇲" },
    stack: ["Flutter", "Firebase", "WebRTC"],
    appreciate: 67, discuss: 9, year: 2024, postedDays: 12,
  },
  {
    slug: "karanta",
    name: "Karanta",
    description: "Wolof and Mandinka language learning app with audio from native speakers.",
    domain: "Edtech",
    builder: { name: "Isatou Bah", handle: "isatou-bah", hue: 25, location: "Brikama, Gambia", flag: "🇬🇲" },
    stack: ["React", "Supabase", "TypeScript"],
    appreciate: 201, discuss: 42, year: 2025, postedDays: 6, seekingCollab: true,
  },
  {
    slug: "openbantaba",
    name: "OpenBantaba",
    description: "Open data portal for The Gambia government services and procurement notices.",
    domain: "Govtech",
    builder: { name: "Kwame Asare", handle: "kwame-asare", hue: 250, location: "Accra, Ghana", flag: "🇬🇭" },
    stack: ["Next.js", "Postgres", "Prisma"],
    appreciate: 54, discuss: 11, year: 2024, postedDays: 22,
  },
  {
    slug: "djembe-ui",
    name: "Djembe UI",
    description: "A warm, rooted React component library inspired by West African textile patterns.",
    domain: "Open Source",
    builder: { name: "Ibrahim Koroma", handle: "ibrahim-koroma", hue: 290, location: "Freetown, Sierra Leone", flag: "🇸🇱" },
    stack: ["React", "Tailwind", "Storybook"],
    appreciate: 98, discuss: 17, year: 2025, postedDays: 2, seekingCollab: true,
  },
];

export const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  { id: "senior-fullstack-paystack", title: "Senior Full Stack Engineer", company: "Paystack", type: "Job", location: "Lagos / Remote", locationType: "Remote", tags: ["TypeScript", "React", "Node.js", "Postgres"], compensation: "$60k–90k", postedDays: 2, logoHue: 250, experience: "Senior", deadlineDays: 18, featured: true, applicants: 42 },
  { id: "mobile-flutter-jumia", title: "Mobile Engineer (Flutter)", company: "Jumia", type: "Job", location: "Dakar", locationType: "Hybrid", tags: ["Flutter", "Dart", "REST"], compensation: "Competitive", postedDays: 5, logoHue: 25, experience: "Mid", deadlineDays: 12, applicants: 18 },
  { id: "contract-frontend-3mo", title: "3-month Front-end Contract", company: "GreenLeaf NGO", type: "Contract", location: "Remote", locationType: "Remote", tags: ["React", "Tailwind", "Accessibility"], compensation: "$8k fixed", postedDays: 1, logoHue: 145, experience: "Mid", deadlineDays: 2, contractDuration: "3 months", projectType: "Full Build", featured: true, applicants: 7 },
  { id: "tony-elumelu-grant", title: "Tony Elumelu Foundation Grant", company: "TEF", type: "Grant", location: "Pan-African", locationType: "Remote", tags: ["Founders", "Seed", "Africa"], compensation: "$5,000", postedDays: 12, logoHue: 60, experience: "Any", deadlineDays: 28, eligibility: ["Open to All", "West Africa"], featured: true, applicants: 312 },
  { id: "mentor-juniors-banjul", title: "Mentor 3 Junior Devs in Banjul", company: "Bantabaa Community", type: "Mentorship", location: "Banjul", locationType: "Hybrid", tags: ["JavaScript", "Career"], compensation: "Volunteer", postedDays: 3, logoHue: 30, experience: "Senior", mentorSlots: 2, sessionFormat: "1:1 Video", featured: true, applicants: 5 },
];

export const DOMAINS: Domain[] = ["Fintech", "Agritech", "Healthtech", "Edtech", "Govtech", "Open Source", "Other"];

export type SpaceGradient =
  | "web" | "mobile" | "data" | "security" | "opensource" | "blockchain"
  | "beginners" | "career" | "senior"
  | "gambia" | "senegal" | "ghana" | "nigeria"
  | "muted";

export type SpaceIcon =
  | "code" | "smartphone" | "barchart" | "shield" | "gitbranch"
  | "bookopen" | "trendingup" | "award" | "mappin";

export interface Space {
  slug: string;
  name: string;
  category: "Domain" | "Stage" | "Country";
  members: number;
  posts: number;
  active: number;
  blurb: string;
  emoji: string;
  gradient: SpaceGradient;
  icon: SpaceIcon;
  comingSoon?: boolean;
  memberHues?: number[];
}

export const SAMPLE_SPACES: Space[] = [
  { slug: "web-development", name: "Web Development", category: "Domain", members: 1284, posts: 86, active: 42, blurb: "Front-end, back-end, the whole tree.", emoji: "🌐", gradient: "web", icon: "code", memberHues: [30, 145, 250] },
  { slug: "mobile", name: "Mobile", category: "Domain", members: 742, posts: 51, active: 19, blurb: "iOS, Android, Flutter, React Native.", emoji: "📱", gradient: "mobile", icon: "smartphone", memberHues: [60, 290, 25] },
  { slug: "data-ai", name: "Data & AI", category: "Domain", members: 511, posts: 38, active: 12, blurb: "From notebooks to production models.", emoji: "🧠", gradient: "data", icon: "barchart", memberHues: [145, 250, 30] },
  { slug: "cybersecurity", name: "Cybersecurity", category: "Domain", members: 198, posts: 14, active: 5, blurb: "Defenders of the digital savanna.", emoji: "🛡️", gradient: "security", icon: "shield", memberHues: [25, 290, 60] },
  { slug: "open-source", name: "Open Source", category: "Domain", members: 433, posts: 27, active: 9, blurb: "Building in public, together.", emoji: "🌱", gradient: "opensource", icon: "gitbranch", memberHues: [145, 30, 250] },
  { slug: "blockchain", name: "Blockchain", category: "Domain", members: 0, posts: 0, active: 0, blurb: "Coming soon — Web3 builders welcome.", emoji: "⛓️", gradient: "muted", icon: "gitbranch", comingSoon: true },
  { slug: "beginners-corner", name: "Beginners Corner", category: "Stage", members: 2106, posts: 142, active: 78, blurb: "No question is too small here.", emoji: "🌱", gradient: "beginners", icon: "bookopen", memberHues: [30, 60, 145] },
  { slug: "career-growth", name: "Career Growth", category: "Stage", members: 1340, posts: 94, active: 36, blurb: "Interviews, salaries, the next step.", emoji: "🪜", gradient: "career", icon: "trendingup", memberHues: [25, 250, 290] },
  { slug: "senior-lounge", name: "Senior Lounge", category: "Stage", members: 287, posts: 22, active: 8, blurb: "Architecture, leadership, scale.", emoji: "🪑", gradient: "senior", icon: "award", memberHues: [290, 30, 250] },
  { slug: "the-gambia", name: "The Gambia", category: "Country", members: 612, posts: 47, active: 21, blurb: "Banjul, Serrekunda, Brikama and beyond.", emoji: "🇬🇲", gradient: "gambia", icon: "mappin", memberHues: [30, 60, 25] },
  { slug: "senegal", name: "Senegal", category: "Country", members: 489, posts: 35, active: 14, blurb: "Dakar to Saint-Louis.", emoji: "🇸🇳", gradient: "senegal", icon: "mappin", memberHues: [145, 60, 25] },
  { slug: "ghana", name: "Ghana", category: "Country", members: 0, posts: 0, active: 0, blurb: "Coming soon — bring your people.", emoji: "🇬🇭", gradient: "muted", icon: "mappin", comingSoon: true },
  { slug: "nigeria", name: "Nigeria", category: "Country", members: 0, posts: 0, active: 0, blurb: "Coming soon — bring your people.", emoji: "🇳🇬", gradient: "muted", icon: "mappin", comingSoon: true },
];
