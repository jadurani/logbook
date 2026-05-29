# Writing Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/writing` listing page and `/writing/[slug]` post template with Astro Content Collections, MDX support, zone-coloured tags, and foundational SEO.

**Architecture:** Astro 6 Content Layer API (`src/content.config.ts` with glob loader) for type-safe MDX posts. Components are small and single-purpose — ZoneTag, PostCard, PostListItem, Nav. Pages compose them. SEO meta tags live in Layout.astro.

**Tech Stack:** Astro 6, Tailwind v4, `@astrojs/mdx`, `@astrojs/sitemap`, TypeScript strict

---

## File Map

| Action | File | Purpose |
|---|---|---|
| Create | `src/content.config.ts` | Content Collections schema |
| Create | `src/content/posts/hello-world.mdx` | Sample post for dev testing |
| Create | `src/components/Nav.astro` | Shared nav + theme toggle (extracted from index.astro) |
| Create | `src/components/ZoneTag.astro` | Glowing zone label |
| Create | `src/components/PostCard.astro` | Card for featured grid |
| Create | `src/components/PostListItem.astro` | Rich row for full list |
| Create | `src/pages/writing/index.astro` | /writing listing page |
| Create | `src/pages/writing/[slug].astro` | /writing/[slug] post page |
| Create | `public/robots.txt` | SEO: allow all + sitemap pointer |
| Modify | `src/styles/global.css` | Zone tokens, new bg, zone-tag glow CSS, prose styles |
| Modify | `src/layouts/Layout.astro` | SEO meta props (description, ogImage) |
| Modify | `src/pages/index.astro` | Use Nav component, remove inline theme toggle script |
| Modify | `astro.config.mjs` | Add site URL, mdx(), sitemap() |

---

## Task 1: Feature branch

- [ ] **Create and switch to feature branch**

```bash
cd /Users/jadurani/code/logbook
git checkout -b feat/writing-section
```

Expected: `Switched to a new branch 'feat/writing-section'`

---

## Task 2: Install MDX and sitemap integrations

- [ ] **Install integrations**

```bash
npx astro add mdx --yes && npx astro add sitemap --yes
```

Expected: Both integrations added, `astro.config.mjs` updated, packages installed.

- [ ] **Verify `astro.config.mjs` looks like this (fix manually if auto-update missed anything)**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rani.ph',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), sitemap()],
});
```

- [ ] **Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "add mdx and sitemap integrations"
```

---

## Task 3: Color system — zone tokens + prose styles

- [ ] **Replace `src/styles/global.css` entirely**

```css
@import "tailwindcss";

@theme {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-accent-mid: var(--accent-mid);
  --color-accent-soft: var(--accent-soft);

  --font-sans: 'Source Sans 3', sans-serif;
  --font-serif: 'Lora', serif;
}

:root,
[data-theme="dark"] {
  --canvas: #080812;
  --surface: #10101e;
  --ink: #f0eee9;
  --muted: #7a7890;
  --accent: #534AB7;
  --accent-mid: #AFA9EC;
  --accent-soft: #EEEDFE;

  --zone-photic: #fde047;
  --zone-aphotic: #e879f9;
  --zone-abyssal: #4ade80;
}

[data-theme="light"] {
  --canvas: #f5f4f0;
  --surface: #ffffff;
  --ink: #1a1925;
  --muted: #6b6878;
  --accent: #534AB7;
  --accent-mid: #534AB7;
  --accent-soft: #EEEDFE;

  /* light mode zone values — deferred, using dark values as placeholder */
  --zone-photic: #fde047;
  --zone-aphotic: #e879f9;
  --zone-abyssal: #4ade80;
}

/* Zone tag glow — can't be done with Tailwind utilities alone */
.zone-tag {
  display: inline-block;
  font-size: 0.5625rem;
  border: 1px solid;
  border-radius: 3px;
  padding: 1px 5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.6;
}

.zone-tag--photic {
  color: var(--zone-photic);
  border-color: var(--zone-photic);
  text-shadow: 0 0 6px var(--zone-photic);
}

.zone-tag--aphotic {
  color: var(--zone-aphotic);
  border-color: var(--zone-aphotic);
  text-shadow: 0 0 6px var(--zone-aphotic);
}

.zone-tag--abyssal {
  color: var(--zone-abyssal);
  border-color: var(--zone-abyssal);
  text-shadow: 0 0 6px var(--zone-abyssal);
}

/* Zone gradient fallbacks for cards without a cover image */
.zone-gradient--photic  { background: linear-gradient(135deg, #1c1500 0%, #2e2200 100%); }
.zone-gradient--aphotic { background: linear-gradient(135deg, #200020 0%, #380038 100%); }
.zone-gradient--abyssal { background: linear-gradient(135deg, #001a0a 0%, #003015 100%); }

/* MDX prose styles */
.prose-logbook {
  color: var(--ink);
  line-height: 1.75;
  font-size: 1rem;
}
.prose-logbook p { margin-bottom: 1.25rem; }
.prose-logbook h2 { font-family: 'Lora', serif; color: var(--ink); font-size: 1.5rem; margin: 2rem 0 0.75rem; }
.prose-logbook h3 { font-family: 'Lora', serif; color: var(--ink); font-size: 1.25rem; margin: 1.75rem 0 0.5rem; }
.prose-logbook a { color: var(--accent-mid); text-decoration: underline; }
.prose-logbook blockquote {
  font-family: 'Lora', serif;
  color: var(--accent-mid);
  font-style: italic;
  border-left: 2px solid var(--accent-mid);
  padding-left: 1rem;
  margin: 1.5rem 0;
}
.prose-logbook img { width: 100%; border-radius: 6px; margin: 1.5rem 0; }
.prose-logbook ul, .prose-logbook ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
.prose-logbook li { margin-bottom: 0.25rem; }
.prose-logbook code {
  background: var(--surface);
  color: var(--accent-mid);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.875em;
}
.prose-logbook pre { background: var(--surface); padding: 1rem; border-radius: 6px; overflow-x: auto; margin: 1.5rem 0; }
.prose-logbook pre code { background: none; padding: 0; color: var(--ink); font-size: 0.875rem; }
```

- [ ] **Verify dev server still starts without errors**

```bash
npm run dev
```

Open `http://localhost:4321` — homepage should render with the new darker background.

- [ ] **Commit**

```bash
git add src/styles/global.css
git commit -m "update color system: zone tokens, new bg, prose styles"
```

---

## Task 4: Content Collections schema

- [ ] **Create `src/content.config.ts`**

```ts
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
```

- [ ] **Create `src/content/posts/` directory with a sample post**

```bash
mkdir -p src/content/posts
```

Create `src/content/posts/hello-world.mdx`:

```mdx
---
title: hello world
date: 2026-05-29
zone: photic
category: tech
description: This site is live. Here's what it is and what it isn't.
draft: false
---

this is the first entry.

it exists to test the rendering pipeline, not to say something meaningful.
but maybe that's how most things start.

> the point is to begin.

more soon.
```

- [ ] **Verify build still passes**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes, no TypeScript errors.

- [ ] **Commit**

```bash
git add src/content.config.ts src/content/posts/hello-world.mdx
git commit -m "add content collections schema and sample post"
```

---

## Task 5: Nav component

Extract the nav + theme toggle out of `index.astro` into a reusable component.

- [ ] **Create `src/components/Nav.astro`**

```astro
<header class="px-6 py-4 flex justify-between items-center border-b border-surface">
  <a href="/" class="text-accent-mid font-serif text-lg tracking-wide hover:text-ink transition-colors">
    logbook
  </a>
  <button
    id="theme-toggle"
    class="text-muted hover:text-ink text-sm transition-colors cursor-pointer"
    aria-label="Toggle theme"
  >
    <span data-theme-icon>◑</span>
  </button>
</header>

<script>
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
</script>
```

- [ ] **Update `src/pages/index.astro` to use Nav and remove its inline header + script**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
---

<Layout>
  <Nav />
  <main class="max-w-xl mx-auto px-6 py-20 flex flex-col gap-6">
    <h1 class="text-ink text-3xl font-serif">hi, i'm rani</h1>
    <p class="text-ink text-lg leading-relaxed">
      i'm a try-athlete — i love trying out things!
    </p>
    <p class="text-muted leading-relaxed">
      this is where i plan to keep track of my world, the things i try, and share it to the rest of the world
    </p>
    <p class="text-muted leading-relaxed">
      this site is a work in progress! always!
    </p>
  </main>
</Layout>
```

- [ ] **Verify dev server — homepage still works, theme toggle still works**

- [ ] **Commit**

```bash
git add src/components/Nav.astro src/pages/index.astro
git commit -m "extract Nav component with theme toggle"
```

---

## Task 6: ZoneTag component

- [ ] **Create `src/components/ZoneTag.astro`**

```astro
---
interface Props {
  zone: 'photic' | 'aphotic' | 'abyssal';
}
const { zone } = Astro.props;
---
<span class={`zone-tag zone-tag--${zone}`}>{zone}</span>
```

- [ ] **Commit**

```bash
git add src/components/ZoneTag.astro
git commit -m "add ZoneTag component"
```

---

## Task 7: PostCard component

- [ ] **Create `src/components/PostCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import ZoneTag from './ZoneTag.astro';

interface Props {
  post: CollectionEntry<'posts'>;
}
const { post } = Astro.props;
const { title, date, zone, cover } = post.data;
const href = `/writing/${post.id}`;
const formattedDate = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
---
<a
  href={href}
  class="block bg-surface border border-surface rounded-lg overflow-hidden hover:border-accent-mid transition-colors group"
>
  {cover ? (
    <img src={cover} alt={title} class="w-full h-40 object-cover" />
  ) : (
    <div class={`w-full h-40 zone-gradient--${zone}`}></div>
  )}
  <div class="p-4">
    <h3 class="text-ink text-sm font-medium mb-2 line-clamp-2 group-hover:text-accent-mid transition-colors">
      {title}
    </h3>
    <div class="flex items-center gap-2">
      <ZoneTag zone={zone} />
      <span class="text-muted text-xs">{formattedDate}</span>
    </div>
  </div>
</a>
```

- [ ] **Commit**

```bash
git add src/components/PostCard.astro
git commit -m "add PostCard component"
```

---

## Task 8: PostListItem component

- [ ] **Create `src/components/PostListItem.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import ZoneTag from './ZoneTag.astro';

interface Props {
  post: CollectionEntry<'posts'>;
}
const { post } = Astro.props;
const { title, date, zone, category, description, cover } = post.data;
const href = `/writing/${post.id}`;
const formattedDate = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
---
<a
  href={href}
  class="flex gap-4 py-4 border-b border-surface hover:bg-surface transition-colors group"
>
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2 mb-2 flex-wrap">
      <ZoneTag zone={zone} />
      <span class="text-muted text-xs">{category}</span>
      <span class="text-muted text-xs">· {formattedDate}</span>
    </div>
    <h3 class="text-ink text-sm font-medium mb-1 group-hover:text-accent-mid transition-colors">
      {title}
    </h3>
    <p class="text-muted text-xs leading-relaxed line-clamp-2">{description}</p>
  </div>
  {cover && (
    <img
      src={cover}
      alt={title}
      class="w-16 h-14 object-cover rounded flex-shrink-0 self-start mt-1"
    />
  )}
</a>
```

- [ ] **Commit**

```bash
git add src/components/PostListItem.astro
git commit -m "add PostListItem component"
```

---

## Task 9: Layout SEO update

- [ ] **Replace `src/layouts/Layout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title = 'logbook',
  description = "rani's logbook — trying things, keeping track",
  ogImage,
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site ?? 'https://rani.ph');
const ogImageURL = ogImage ? new URL(ogImage, Astro.site ?? 'https://rani.ph').toString() : undefined;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalURL} />
    {ogImageURL && <meta property="og:image" content={ogImageURL} />}

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Source+Sans+3:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <script is:inline>
      (function () {
        const saved = localStorage.getItem('theme');
        document.documentElement.setAttribute('data-theme', saved || 'dark');
      })();
    </script>
  </head>
  <body class="bg-canvas text-ink font-sans min-h-screen">
    <slot />
  </body>
</html>
```

- [ ] **Verify build passes**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "add SEO meta props to Layout"
```

---

## Task 10: /writing listing page

- [ ] **Create `src/pages/writing/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import PostCard from '../../components/PostCard.astro';
import PostListItem from '../../components/PostListItem.astro';

const allPosts = await getCollection('posts', ({ data }) => !data.draft);
const sorted = allPosts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const featured = sorted.slice(0, 3);
---

<Layout
  title="writing — logbook"
  description="Things I write about diving, mountains, travel, tech, and people."
>
  <Nav />
  <main class="max-w-2xl mx-auto px-6 py-12">
    {featured.length > 0 && (
      <>
        <p class="text-muted text-xs uppercase tracking-widest mb-4">latest</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {featured.map(post => <PostCard post={post} />)}
        </div>
        <hr class="border-t border-surface mb-8" />
      </>
    )}
    <p class="text-muted text-xs uppercase tracking-widest mb-4">all posts</p>
    <div>
      {sorted.map(post => <PostListItem post={post} />)}
    </div>
  </main>
</Layout>
```

- [ ] **Verify in dev server**

```bash
npm run dev
```

Open `http://localhost:4321/writing` — should show the featured card grid and the full list with the sample post.

- [ ] **Commit**

```bash
git add src/pages/writing/index.astro
git commit -m "add /writing listing page"
```

---

## Task 11: /writing/[slug] post page

- [ ] **Create `src/pages/writing/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import ZoneTag from '../../components/ZoneTag.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { title, date, zone, category, cover, description } = post.data;
const { Content } = await render(post);
const formattedDate = date.toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
---

<Layout title={`${title} — logbook`} description={description} ogImage={cover}>
  <Nav />

  {cover && (
    <div class="w-full">
      <img src={cover} alt={title} class="w-full max-h-96 object-cover" />
    </div>
  )}

  <main class="max-w-2xl mx-auto px-6 py-12">
    <div class="flex items-center gap-2 mb-4 flex-wrap">
      <ZoneTag zone={zone} />
      <span class="text-muted text-xs">{category}</span>
      <span class="text-muted text-xs">· {formattedDate}</span>
    </div>
    <h1 class="text-ink text-3xl font-serif mb-8 leading-tight">{title}</h1>
    <div class="prose-logbook">
      <Content />
    </div>

    <!-- Giscus comments placeholder — configure once Giscus repo is set up -->
    {/* <script src="https://giscus.app/client.js" ... async></script> */}
  </main>
</Layout>
```

- [ ] **Verify in dev server**

Open `http://localhost:4321/writing/hello-world` — should render the full post with title, zone tag, date, and MDX content.

- [ ] **Commit**

```bash
git add src/pages/writing/[slug].astro
git commit -m "add /writing/[slug] post template"
```

---

## Task 12: SEO — robots.txt

The sitemap integration was installed in Task 2. Now add robots.txt.

- [ ] **Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://rani.ph/sitemap-index.xml
```

- [ ] **Verify sitemap generates on build**

```bash
npm run build && ls dist/ | grep sitemap
```

Expected: `sitemap-index.xml` present in `dist/`.

- [ ] **Commit**

```bash
git add public/robots.txt
git commit -m "add robots.txt and verify sitemap output"
```

---

## Task 13: Full build verification + PR

- [ ] **Run full build, confirm no errors**

```bash
npm run build 2>&1
```

Expected: exits 0, no TypeScript errors, no broken imports.

- [ ] **Check all pages render in preview**

```bash
npm run preview
```

Open and verify:
- `http://localhost:4321/` — homepage intact
- `http://localhost:4321/writing` — card grid + list
- `http://localhost:4321/writing/hello-world` — post renders
- `http://localhost:4321/sitemap-index.xml` — sitemap present

- [ ] **Push branch and open PR**

```bash
git push origin feat/writing-section
gh pr create --title "feat: writing section + SEO" --body "$(cat <<'EOF'
## Summary
- Astro Content Collections for MDX posts with Zod schema validation
- Hybrid listing layout: card grid (latest 3) + rich list (all posts)
- Post template: full-width cover + centred reading column
- ZoneTag component with UV fluorescence glow colors (photic/aphotic/abyssal)
- Layout SEO meta tags (title, description, og:image)
- @astrojs/sitemap + robots.txt

## Test plan
- [ ] `npm run build` exits 0
- [ ] `/writing` renders card grid and list with sample post
- [ ] `/writing/hello-world` renders post with zone tag, date, prose
- [ ] Theme toggle works on all pages
- [ ] `dist/sitemap-index.xml` present after build

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Out of Scope (this plan)

- Keystatic CMS setup (separate plan — verify Astro 6 compatibility first)
- Light mode zone tag styling
- Giscus comments configuration
- Zone/category filtering on /writing
- Quest post template
