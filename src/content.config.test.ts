import { describe, expect, it, vi } from 'vitest';
import type { ZodType } from 'astro/zod';

vi.mock('astro:content', () => ({
  defineCollection: (config: unknown) => config,
}));

const { collections } = await import('./content.config');

const asStaticSchema = (schema: unknown): ZodType => {
  if (!schema || typeof schema === 'function') {
    throw new Error('expected a static (non-function) schema');
  }
  return schema as ZodType;
};

const profileSchema = asStaticSchema(collections.profile.schema);
const projectSchema = asStaticSchema(collections.projects.schema);

describe('profile collection schema', () => {
  const validProfile: Record<string, unknown> = {
    name: 'Kaeden Monroe',
    role: 'Mechanical Engineering — Systems',
    heroHeadline: 'Building the hardware that thinks for itself.',
    heroSubtext: 'Third-year ME student prototyping mobile robotics.',
    resumeUrl: 'https://example.com/resume.pdf',
    email: 'someone@example.com',
    linkedinUrl: 'https://www.linkedin.com/in/someone',
    githubUrl: 'https://github.com/someone',
    copyrightName: 'Kaeden Monroe',
  };

  it('accepts a fully valid profile', () => {
    // AC-1
    const result = profileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('accepts an optional blogUrl when present and well formed', () => {
    // AC-1
    const result = profileSchema.safeParse({
      ...validProfile,
      blogUrl: 'https://example.com/blog',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a profile with no blogUrl at all, since it is optional', () => {
    // AC-1
    const result = profileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('rejects a profile missing a required field', () => {
    // AC-1
    const result = profileSchema.safeParse({ ...validProfile, email: undefined });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed email', () => {
    // AC-6
    const result = profileSchema.safeParse({ ...validProfile, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it.each(['resumeUrl', 'linkedinUrl', 'githubUrl'])('rejects a malformed %s', (field) => {
    // AC-6
    const result = profileSchema.safeParse({ ...validProfile, [field]: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed optional blogUrl', () => {
    // AC-6
    const result = profileSchema.safeParse({ ...validProfile, blogUrl: 'not-a-url' });
    expect(result.success).toBe(false);
  });
});

describe('projects collection schema', () => {
  const validProject: Record<string, unknown> = {
    title: 'Autonomous Ground Platform',
    subtitle: 'Skid-steer chassis, sensor fusion, ROS2 nav stack',
    image: '/images/projects/placeholder.svg',
  };

  it('accepts a fully valid project', () => {
    // AC-3
    const result = projectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('rejects a project missing its image', () => {
    // AC-3, AC-6
    const result = projectSchema.safeParse({ ...validProject, image: undefined });
    expect(result.success).toBe(false);
  });

  it('rejects a project missing its title', () => {
    // AC-3
    const result = projectSchema.safeParse({ ...validProject, title: undefined });
    expect(result.success).toBe(false);
  });

  it('rejects a project missing its subtitle', () => {
    // AC-3
    const result = projectSchema.safeParse({ ...validProject, subtitle: undefined });
    expect(result.success).toBe(false);
  });
});
