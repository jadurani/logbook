import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    zone: z.enum(['photic', 'aphotic', 'abyssal']),
    category: z.enum(['diving', 'mountains', 'travel', 'tech', 'people', 'labs']),
    description: z.string(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
