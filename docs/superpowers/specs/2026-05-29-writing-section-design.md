# Writing Section + SEO — Design Spec
_Date: 2026-05-29_

## Overview

Add the writing/blog section to rani.ph (logbook repo), along with a git-based CMS for authoring and foundational SEO. No database, no external service beyond what's already on Cloudflare.

---

## Color System Update

The current purple accent tokens remain. New zone-specific tokens are added.

**New background:** `#080812` (deeper blue-black, replaces `#0f0e13`)

**Zone tokens (dark mode — glowing):**

| CSS variable | Value | Zone |
|---|---|---|
| `--zone-photic` | `#fde047` | bright yellow |
| `--zone-aphotic` | `#e879f9` | magenta |
| `--zone-abyssal` | `#4ade80` | neon green |

**Light mode zone values:** deferred. Tokens defined in `[data-theme="light"]` block as placeholders matching dark values. Revisit when light mode is prioritised.

Tailwind utilities generated: `text-zone-photic`, `text-zone-aphotic`, `text-zone-abyssal`, and matching `border-zone-*` variants via `@theme` in `global.css`.

---

## Content Schema

Location: `src/content/posts/*.mdx`

```yaml
---
title: string           # required
date: date              # required, YYYY-MM-DD
zone: photic | aphotic | abyssal   # required
category: diving | mountains | travel | tech | people | labs  # required
description: string     # required — used as list summary + meta description
cover: string           # optional — e.g. /images/tubbataha.jpg
draft: boolean          # optional, default false — drafts excluded from build
---
```

Defined as an Astro Content Collection in `src/content/config.ts` using `defineCollection` + `z` (Zod) schema. Type-safe, build errors on invalid frontmatter.

---

## Routes

### `/writing`
Hybrid listing page.

**Top section — featured grid:**
- Latest 3 published posts displayed as cards (3-column on desktop, 1-column on mobile)
- Each card: cover image (zone-tinted gradient fallback if no cover), title, zone tag, date
- Card image area uses a gradient derived from the post's zone color when no cover is set

**Bottom section — full list:**
- All published posts in reverse chronological order
- Each row: zone tag + category + date · title · description summary · optional side thumbnail (64×56px, right-aligned)
- Posts without a cover image render without the thumbnail slot — no empty gap

### `/writing/[slug]`
Post reading page.

**Structure (top to bottom):**
1. Full-width cover image (if present) — no max-width, bleeds to container edges
2. Reading column — max-width ~680px, centred
3. Zone tag + category + date (meta row)
4. Title (Lora serif, large)
5. MDX body — Source Sans 3, comfortable line-height
6. Pullquote component: Lora italic, accent-mid color, left border
7. Giscus placeholder — component slot added at end of post, commented out until Giscus repo is configured

---

## Components

### `ZoneTag.astro`
Props: `zone: 'photic' | 'aphotic' | 'abyssal'`

Renders a small uppercase tag with the zone's color + text-shadow glow. Used everywhere a zone label appears (listing, post header, cards).

### `PostCard.astro`
Props: `post` (content collection entry)

Card for the featured grid. Cover image with `object-fit: cover`; falls back to a zone-tinted gradient div. Shows title, `ZoneTag`, date.

### `PostListItem.astro`
Props: `post` (content collection entry)

Rich list row. Left: meta row (ZoneTag, category, date) + title + description. Right: thumbnail if `cover` is set, otherwise no slot.

### `Layout.astro` (updated)
New optional props: `description`, `ogImage`. Adds `<meta name="description">`, `<og:title>`, `<og:description>`, `<og:image>` to `<head>`. Falls back to site-level defaults when not passed.

---

## CMS: Keystatic

Keystatic is an Astro-native, git-based CMS. The admin UI runs at `/keystatic` during local development. It writes MDX files directly to `src/content/posts/` and commits via git — no external database.

**Setup:**
- Install `@keystatic/core` + `@keystatic/astro`
- Add Keystatic integration to `astro.config.mjs`
- `keystatic.config.ts` at repo root — defines the `posts` collection matching the schema above
- Image uploads saved to `public/images/` via Keystatic's local asset storage

**Deployment:**
- `/keystatic` route is excluded from the Cloudflare Pages build (Keystatic runs local-only)
- No cloud/hosted Keystatic account needed for now

---

## SEO

### Sitemap
- Install `@astrojs/sitemap`
- Add to `astro.config.mjs` with `site: 'https://rani.ph'`
- Generates `/sitemap-index.xml` automatically on every build
- Includes all `/writing/[slug]` URLs

### robots.txt
`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://rani.ph/sitemap-index.xml
```

### Per-page meta tags (Layout.astro)
Every page gets: `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`, `<meta property="og:type">`.

Post pages pass `description` (from frontmatter) and `ogImage` (cover, if set) to Layout.

### Google Search Console
Manual step after deploy: verify ownership via HTML tag in Layout, submit sitemap URL. Not part of implementation.

---

## Image Handling

Images live in `public/images/`. Referenced in frontmatter as `/images/filename.jpg`.

Keystatic's local asset storage writes uploads directly to `public/images/` through the admin UI.

Migration path to Cloudflare R2: when the repo becomes heavy (~100+ posts with photos), update Keystatic's asset storage config to point to R2. Existing image paths remain the same if R2 is served via a `rani.ph/images/` path alias.

---

## Out of Scope (this phase)

- Zone filtering / tag filtering on `/writing`
- Quest posts (separate template with lat/lng/map)
- `/quests`, `/labs`, `/now`, `/about-the-zones` pages
- Light mode zone tag styling
- Giscus comment configuration
- Cloudflare R2 migration
