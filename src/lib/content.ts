import { getCollection, render, type CollectionEntry } from 'astro:content';
import { skillCategories, type SkillCategory } from '../../data/skills';

type RenderedContent = Awaited<ReturnType<typeof render>>['Content'];

export type Profile = CollectionEntry<'profile'>['data'] & {
  Content: RenderedContent;
};

export const getProfile = async (): Promise<Profile> => {
  const [entry] = await getCollection('profile');
  if (!entry) {
    throw new Error('content/profile.md is missing');
  }
  const { Content } = await render(entry);
  return { ...entry.data, Content };
};

export type Project = CollectionEntry<'projects'>['data'] & {
  slug: string;
  tag: string;
  Content: RenderedContent;
};

export const getProjects = async (): Promise<Project[]> => {
  const entries = await getCollection('projects');
  return Promise.all(
    entries.map(async (entry, index) => {
      const { Content } = await render(entry);
      return {
        ...entry.data,
        slug: entry.id,
        tag: `IDX ${String(index + 1).padStart(2, '0')}`,
        Content,
      };
    })
  );
};

export type { SkillCategory };

export const getSkillCategories = (): SkillCategory[] => {
  skillCategories.forEach((category) => {
    if (category.tags.length === 0) {
      throw new Error(`Skill category "${category.name}" has no tags`);
    }
  });
  return skillCategories;
};
