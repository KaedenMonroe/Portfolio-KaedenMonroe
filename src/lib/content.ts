import { getCollection, getEntry } from "astro:content";

export async function getBio() {
  const bio = await getEntry("bio", "index");
  if (!bio) throw new Error("Missing src/content/bio/index.md");
  return bio;
}

export async function getVisibleProjects() {
  const projects = await getCollection(
    "projects",
    (entry) => !entry.data.draft,
  );
  return projects.sort((a, b) => a.data.order - b.data.order);
}
