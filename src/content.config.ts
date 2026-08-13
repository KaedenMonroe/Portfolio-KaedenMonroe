import { defineCollection } from "astro:content";
import type { ImageFunction } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const galleryItem = (image: ImageFunction) =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("image"),
      src: image(),
      alt: z.string().min(1),
    }),
    z.object({
      type: z.literal("video"),
      src: z.string().startsWith("/videos/"),
      alt: z.string().min(1),
    }),
  ]);

const bio = defineCollection({
  loader: glob({ pattern: "index.md", base: "./src/content/bio" }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      title: z.string().min(1),
      avatar: image(),
      avatarAlt: z.string().min(1),
      email: z.email(),
      resumeUrl: z.union([z.url(), z.string().startsWith("/")]),
      linkedinUrl: z.url(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      tags: z.array(z.string()).default([]),
      cover: image(),
      coverAlt: z.string().min(1),
      gallery: z.array(galleryItem(image)).default([]),
      liveUrl: z.url().optional(),
      githubUrl: z.url().optional(),
      order: z.number().int(),
      date: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { bio, projects };
