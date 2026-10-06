import { getCollection, type CollectionEntry } from 'astro:content';

/** URL slug for a tag: "Code Editor" -> "code-editor". */
export const tagSlug = (tag: string): string =>
  tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Drafts show while running the dev server; a production build omits them. */
export const isPublished = (post: CollectionEntry<'posts'>): boolean =>
  import.meta.env.DEV || !post.data.draft;

/** Published posts, newest first. */
export const publishedPosts = async (): Promise<CollectionEntry<'posts'>[]> => {
  const posts = await getCollection('posts');
  return posts
    .filter(isPublished)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
};
