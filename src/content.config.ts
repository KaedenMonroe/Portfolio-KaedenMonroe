import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const profile = defineCollection({
  loader: glob({ pattern: 'profile.md', base: './content' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    heroHeadline: z.string(),
    heroSubtext: z.string(),
    seoDescription: z.string(),
    resumeUrl: z.url(),
    email: z.email(),
    linkedinUrl: z.url(),
    githubUrl: z.url(),
    blogUrl: z.url().optional(),
    copyrightName: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    image: z.string(),
  }),
});

export const collections = { profile, projects };
