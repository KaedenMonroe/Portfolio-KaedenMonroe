import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CollectionEntry } from 'astro:content';

const { getCollection, render } = vi.hoisted(() => ({
  getCollection: vi.fn(),
  render: vi.fn(),
}));

vi.mock('astro:content', () => ({ getCollection, render }));

const { getProfile, getProjects, getSkillCategories } = await import('./content');

const fakeContent = { Content: (() => null) as unknown };

const profileEntry = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 'profile',
    data: {
      name: 'Kaeden Monroe',
      role: 'Mechanical Engineering — Systems',
      heroHeadline: 'Building the hardware that thinks for itself.',
      heroSubtext: 'Third-year ME student prototyping mobile robotics.',
      resumeUrl: 'https://example.com/resume.pdf',
      email: 'someone@example.com',
      linkedinUrl: 'https://www.linkedin.com/in/someone',
      githubUrl: 'https://github.com/someone',
      copyrightName: 'Kaeden Monroe',
      ...overrides,
    },
  }) as unknown as CollectionEntry<'profile'>;

const projectEntry = (id: string, title: string, body?: string) =>
  ({
    id,
    data: {
      title,
      subtitle: `${title} subtitle`,
      image: '/images/projects/placeholder.svg',
    },
    ...(body !== undefined ? { body } : {}),
  }) as unknown as CollectionEntry<'projects'>;

beforeEach(() => {
  getCollection.mockReset();
  render.mockReset();
});

describe('getProfile', () => {
  it('returns the profile record with its rendered body', async () => {
    // AC-1
    const entry = profileEntry();
    getCollection.mockResolvedValue([entry]);
    render.mockResolvedValue(fakeContent);

    const profile = await getProfile();

    expect(profile.name).toBe('Kaeden Monroe');
    expect(profile.email).toBe('someone@example.com');
    expect(profile.Content).toBe(fakeContent.Content);
    expect(render).toHaveBeenCalledWith(entry);
  });

  it('throws when content/profile.md has no entry', async () => {
    // AC-1
    getCollection.mockResolvedValue([]);

    await expect(getProfile()).rejects.toThrow('content/profile.md is missing');
  });
});

describe('getProjects', () => {
  it('derives each tag from list position, never from stored content', async () => {
    // AC-4
    getCollection.mockResolvedValue([
      projectEntry('autonomous-ground-platform', 'Autonomous Ground Platform'),
      projectEntry('quadrotor-prototype', 'Quadrotor Prototype'),
      projectEntry('suspension-bracket-fea-study', 'Suspension Bracket FEA Study'),
    ]);
    render.mockResolvedValue(fakeContent);

    const projects = await getProjects();

    expect(projects.map((p) => p.tag)).toEqual(['IDX 01', 'IDX 02', 'IDX 03']);
    expect(projects.map((p) => p.slug)).toEqual([
      'autonomous-ground-platform',
      'quadrotor-prototype',
      'suspension-bracket-fea-study',
    ]);
  });

  it('reflects a changed file order in the derived tags, proving the tag is never stored', async () => {
    // AC-4
    getCollection.mockResolvedValue([
      projectEntry('suspension-bracket-fea-study', 'Suspension Bracket FEA Study'),
      projectEntry('autonomous-ground-platform', 'Autonomous Ground Platform'),
    ]);
    render.mockResolvedValue(fakeContent);

    const projects = await getProjects();

    expect(projects[0].slug).toBe('suspension-bracket-fea-study');
    expect(projects[0].tag).toBe('IDX 01');
    expect(projects[1].slug).toBe('autonomous-ground-platform');
    expect(projects[1].tag).toBe('IDX 02');
  });

  it('returns an empty list rather than throwing when there are no project files', async () => {
    // AC-5
    getCollection.mockResolvedValue([]);

    const projects = await getProjects();

    expect(projects).toEqual([]);
  });

  it('derives detail from the entry raw markdown body, trimmed of surrounding whitespace', async () => {
    // spec 0003 support: feeds LedgerRow's `detail: string` prop (AC-3)
    getCollection.mockResolvedValue([
      projectEntry(
        'autonomous-ground-platform',
        'Autonomous Ground Platform',
        '\n  Designed and machined a 4-wheel skid-steer chassis.  \n'
      ),
    ]);
    render.mockResolvedValue(fakeContent);

    const [project] = await getProjects();

    expect(project.detail).toBe('Designed and machined a 4-wheel skid-steer chassis.');
  });

  it('returns an empty detail string rather than throwing when an entry has no body', async () => {
    getCollection.mockResolvedValue([projectEntry('quadrotor-prototype', 'Quadrotor Prototype')]);
    render.mockResolvedValue(fakeContent);

    const [project] = await getProjects();

    expect(project.detail).toBe('');
  });
});

describe('getSkillCategories', () => {
  it('returns the real skill categories, each with at least one tag', () => {
    // AC-2, AC-7
    const categories = getSkillCategories();

    expect(categories.length).toBeGreaterThan(0);
    categories.forEach((category) => {
      expect(category.tags.length).toBeGreaterThan(0);
    });
  });

  it('throws when a category has zero tags', async () => {
    // AC-2
    vi.resetModules();
    vi.doMock('../../data/skills', () => ({
      skillCategories: [{ name: 'Empty Category', tags: [] }],
    }));

    const { getSkillCategories: getSkillCategoriesWithEmptyFixture } = await import('./content');

    expect(() => getSkillCategoriesWithEmptyFixture()).toThrow(
      'Skill category "Empty Category" has no tags'
    );

    vi.doUnmock('../../data/skills');
    vi.resetModules();
  });
});
