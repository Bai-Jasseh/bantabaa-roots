import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Developer } from "@/components/DeveloperCard";
import type { Project, Domain } from "@/components/ProjectCard";
import type { Opportunity, OpportunityType, LocationType, ExperienceLevel } from "@/components/OpportunityCard";

export type ProfileRow = Tables<"profiles">;
export type ProjectRow = Tables<"projects">;
export type OpportunityRow = Tables<"opportunities">;
export type SpaceRow = Tables<"spaces">;
export type DiscussionRow = Tables<"discussions">;
export type ReplyRow = Tables<"discussion_replies">;

// ---------- Mappers ----------

export function profileToDeveloper(p: ProfileRow): Developer {
  const openMap: Record<string, Developer["openTo"]> = {
    work: "Work",
    freelance: "Freelance",
    collaboration: "Collaboration",
    mentoring: "Mentoring",
  };
  const first = (p.open_to ?? []).find((x) => x !== "not_available");
  return {
    handle: p.handle,
    name: p.full_name,
    title: p.title ?? "Developer",
    location: [p.city, p.country].filter(Boolean).join(", ") || "West Africa",
    flag: p.flag ?? "🌍",
    skills: p.skills ?? [],
    openTo: first ? openMap[first] : undefined,
    avatarHue: p.avatar_hue ?? 30,
  };
}

export function projectRowToProject(
  p: ProjectRow,
  builder: ProfileRow | null,
  appreciate = 0,
  discuss = 0,
): Project {
  const days = Math.max(0, Math.floor((Date.now() - new Date(p.created_at).getTime()) / 86_400_000));
  return {
    slug: p.slug,
    name: p.name,
    description: p.description,
    domain: (["Fintech","Agritech","Healthtech","Edtech","Govtech","Open Source"].includes(p.domain) ? p.domain : "Other") as Domain,
    builder: builder
      ? {
          name: builder.full_name,
          handle: builder.handle,
          hue: builder.avatar_hue ?? 30,
          location: [builder.city, builder.country].filter(Boolean).join(", "),
          flag: builder.flag ?? "🌍",
        }
      : { name: "Unknown", handle: "" },
    stack: p.stack ?? [],
    appreciate,
    discuss,
    year: new Date(p.created_at).getFullYear(),
    postedDays: days,
    seekingCollab: p.seeking_collab,
    featured: p.featured,
  };
}

export function opportunityRowToOpportunity(o: OpportunityRow): Opportunity {
  const days = Math.max(0, Math.floor((Date.now() - new Date(o.created_at).getTime()) / 86_400_000));
  const deadlineDays = o.deadline
    ? Math.max(0, Math.ceil((new Date(o.deadline).getTime() - Date.now()) / 86_400_000))
    : undefined;
  return {
    id: o.id,
    title: o.title,
    company: o.company,
    type: o.type as OpportunityType,
    location: o.location ?? "Remote",
    locationType: (o.location_type ?? "Remote") as LocationType,
    tags: o.tags ?? [],
    compensation: o.compensation ?? undefined,
    postedDays: days,
    logoHue: o.logo_hue ?? 30,
    experience: (o.experience as ExperienceLevel | null) ?? undefined,
    deadlineDays,
    featured: o.featured,
    contractDuration: o.contract_duration ?? undefined,
    projectType: o.project_type ?? undefined,
    eligibility: o.eligibility ?? undefined,
    mentorSlots: o.mentor_slots ?? undefined,
    sessionFormat: o.session_format ?? undefined,
  };
}

// ---------- Profiles ----------

export async function fetchProfileByHandle(handle: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("handle", handle).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchAllProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("onboarding_completed", true)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}

// ---------- Projects ----------

export async function fetchProjectsWithBuilders() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  const builderIds = Array.from(new Set((projects ?? []).map((p) => p.builder_id)));
  const builders = builderIds.length
    ? (await supabase.from("profiles").select("*").in("id", builderIds)).data ?? []
    : [];
  const reactions = (await supabase.from("project_reactions").select("project_id, kind")).data ?? [];
  const counts = new Map<string, { appreciate: number; discuss: number }>();
  reactions.forEach((r) => {
    const c = counts.get(r.project_id) ?? { appreciate: 0, discuss: 0 };
    if (r.kind === "appreciate") c.appreciate += 1;
    counts.set(r.project_id, c);
  });
  const byId = new Map(builders.map((b) => [b.id, b]));
  return (projects ?? []).map((p) => ({
    row: p,
    builder: byId.get(p.builder_id) ?? null,
    project: projectRowToProject(p, byId.get(p.builder_id) ?? null, counts.get(p.id)?.appreciate ?? 0, counts.get(p.id)?.discuss ?? 0),
  }));
}

export async function fetchProjectBySlug(slug: string) {
  const { data: project, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!project) return null;
  const { data: builder } = await supabase.from("profiles").select("*").eq("id", project.builder_id).maybeSingle();
  const { data: reactions } = await supabase.from("project_reactions").select("kind, user_id").eq("project_id", project.id);
  const appreciate = (reactions ?? []).filter((r) => r.kind === "appreciate").length;
  return {
    row: project,
    builder: builder ?? null,
    project: projectRowToProject(project, builder ?? null, appreciate, 0),
    reactions: reactions ?? [],
  };
}

// ---------- Opportunities ----------

export async function fetchOpportunities() {
  const { data, error } = await supabase.from("opportunities").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []).map(opportunityRowToOpportunity);
}

export async function fetchOpportunityById(id: string) {
  const { data, error } = await supabase.from("opportunities").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? opportunityRowToOpportunity(data) : null;
}

// ---------- Spaces & discussions ----------

export async function fetchSpaces(): Promise<SpaceRow[]> {
  const { data, error } = await supabase.from("spaces").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchSpaceBySlug(slug: string): Promise<SpaceRow | null> {
  const { data, error } = await supabase.from("spaces").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchDiscussionsForSpace(spaceId: string) {
  const { data, error } = await supabase
    .from("discussions")
    .select("*")
    .eq("space_id", spaceId)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  const list = data ?? [];
  const authorIds = Array.from(new Set(list.map((d) => d.author_id)));
  const authors = authorIds.length
    ? (await supabase.from("profiles").select("*").in("id", authorIds)).data ?? []
    : [];
  const byId = new Map(authors.map((a) => [a.id, a]));
  // counts
  const ids = list.map((d) => d.id);
  const replies = ids.length
    ? (await supabase.from("discussion_replies").select("discussion_id").in("discussion_id", ids)).data ?? []
    : [];
  const votes = ids.length
    ? (await supabase.from("discussion_votes").select("discussion_id, vote").in("discussion_id", ids)).data ?? []
    : [];
  const replyCount = new Map<string, number>();
  replies.forEach((r) => replyCount.set(r.discussion_id, (replyCount.get(r.discussion_id) ?? 0) + 1));
  const voteCount = new Map<string, number>();
  votes.forEach((v) => {
    if (!v.discussion_id) return;
    voteCount.set(v.discussion_id, (voteCount.get(v.discussion_id) ?? 0) + (v.vote === "up" ? 1 : -1));
  });
  return list.map((d) => ({
    row: d,
    author: byId.get(d.author_id) ?? null,
    replies: replyCount.get(d.id) ?? 0,
    upvotes: voteCount.get(d.id) ?? 0,
  }));
}

export async function fetchDiscussion(id: string) {
  const { data, error } = await supabase.from("discussions").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

// ---------- Memberships, saves, votes ----------

export async function fetchMyMemberships(userId: string) {
  const { data } = await supabase.from("space_members").select("space_id").eq("user_id", userId);
  return new Set((data ?? []).map((r) => r.space_id));
}

export async function fetchMySavedOpps(userId: string) {
  const { data } = await supabase.from("saved_opportunities").select("opportunity_id").eq("user_id", userId);
  return new Set((data ?? []).map((r) => r.opportunity_id));
}
