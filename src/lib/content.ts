import { getCollection, getEntry } from "astro:content";
import { assertCardWidthInRange } from "./cardSize";

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
  const sorted = projects.sort((a, b) => a.data.order - b.data.order);
  for (const project of sorted) {
    assertCardWidthInRange(
      project.id,
      project.data.cover.width / project.data.cover.height,
    );
  }
  return sorted;
}
