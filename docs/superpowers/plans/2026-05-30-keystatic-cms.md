# Keystatic CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Keystatic as a local-only git-based CMS, giving a web UI at `/keystatic` for writing and publishing posts without touching the terminal or editing MDX by hand.

**Architecture:** Switch Astro to `output: 'hybrid'` (static by default, server-rendered where needed) with the Cloudflare adapter so deployment still works. Keystatic requires React — add `@astrojs/react`. The `@keystatic/astro` integration automatically injects the `/keystatic` admin UI routes; no manual route files needed. `storage: { kind: 'local' }` means it reads/writes MDX files directly in `src/content/posts/` — no database, no cloud account. The admin UI is only functional locally; on the deployed site the routes exist but do nothing without filesystem access.

**Tech Stack:** Astro 6 hybrid, `@keystatic/core` + `@keystatic/astro`, `@astrojs/react`, `@astrojs/cloudflare`, React 19

---

## File Map

| Action | File | Purpose |
|---|---|---|
| Create | `keystatic.config.ts` | Collection schema + local storage config |
| Modify | `astro.config.mjs` | output: hybrid, cloudflare adapter, react + keystatic integrations |

---

## Task 1: Install dependencies and update config

- [ ] **Install packages**

```bash
npm install @keystatic/core @keystatic/astro
npx astro add react --yes
npx astro add cloudflare --yes
```

- [ ] **Read the resulting `astro.config.mjs` and fix it to match exactly:**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';

export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare(),
  site: 'https://rani.ph',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), sitemap(), react(), keystatic()],
});
```

- [ ] **Verify build still passes (existing pages must not break)**

```bash
npm run build 2>&1 | tail -20
```

Expected: exits 0, all existing pages built.

- [ ] **Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "add keystatic, react, cloudflare adapter; set output: hybrid"
```

---

## Task 2: Keystatic config

- [ ] **Create `keystatic.config.ts` at repo root**

```ts
import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        zone: fields.select({
          label: 'Zone',
          options: [
            { label: 'Photic', value: 'photic' },
            { label: 'Aphotic', value: 'aphotic' },
            { label: 'Abyssal', value: 'abyssal' },
          ],
          defaultValue: 'photic',
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Diving', value: 'diving' },
            { label: 'Mountains', value: 'mountains' },
            { label: 'Travel', value: 'travel' },
            { label: 'Tech', value: 'tech' },
            { label: 'People', value: 'people' },
            { label: 'Labs', value: 'labs' },
          ],
          defaultValue: 'tech',
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        cover: fields.image({
          label: 'Cover image',
          directory: 'public/images',
          publicPath: '/images/',
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
  },
});
```

- [ ] **Verify dev server starts and `/keystatic` is accessible**

```bash
npm run dev
```

Open `http://localhost:4321/keystatic` — should show the Keystatic admin UI with a "Posts" collection visible.

- [ ] **Verify existing pages still work**

Check `http://localhost:4321/`, `http://localhost:4321/writing`, `http://localhost:4321/writing/hello-world` — all should render normally.

- [ ] **Commit**

```bash
git add keystatic.config.ts
git commit -m "add keystatic.config.ts with posts collection schema"
```

---

## Task 3: Build verification + PR

- [ ] **Run full build**

```bash
npm run build 2>&1
```

Expected: exits 0, all pages built including Keystatic routes.

- [ ] **Push and open PR**

```bash
git push origin feat/keystatic
gh pr create --base feat/writing-section --title "feat: keystatic local CMS" --body "$(cat <<'EOF'
## Summary
Adds Keystatic as a local-only git-based CMS for writing and publishing posts.

- Install `@keystatic/core`, `@keystatic/astro`, React, Cloudflare adapter
- Switch to `output: 'hybrid'` (all existing pages remain static)
- `keystatic.config.ts` with full posts schema (title, date, zone, category, description, cover, draft, content)
- Admin UI at `http://localhost:4321/keystatic` during local dev
- Image uploads saved to `public/images/`
- Deployed site is unaffected — Keystatic routes exist but are inert without local filesystem

## Local usage
1. `npm run dev`
2. Open `http://localhost:4321/keystatic`
3. Write post → save → Keystatic commits MDX to `src/content/posts/`
4. `git push origin main` → Cloudflare deploys

## Test plan
- [ ] `npm run build` exits 0
- [ ] `/keystatic` shows admin UI in local dev
- [ ] Posts collection visible with all fields
- [ ] Existing pages (`/`, `/writing`, `/writing/hello-world`) render correctly

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Note: PR targets `feat/writing-section` (not main) since this branch is built on top of it.

---

## Out of Scope

- Keystatic Cloud / remote editing (not needed for local-only workflow)
- GitHub mode (requires Keystatic Cloud account)
