# CLAUDE.md — logbook / rani.ph

## Hard Rules

- **Never generate prose, copy, or content for the site.** All writing is Rani's.
  Leave `<!-- Rani writes this -->` wherever content belongs.
- **Colors only — do not override Tailwind's default spacing, layout, or utility classes.**
  Tailwind's spacing scale, flexbox, grid, typography scale, etc. are used as-is.
  Only the color palette is replaced with custom tokens.
- **This project uses Tailwind v4.** There is no `tailwind.config.js`. Token configuration
  lives in `src/styles/global.css` using `@theme`. Do not create a config file.

## Stack

- Framework: Astro
- Styling: Tailwind CSS (colors replaced with custom tokens; everything else default)
- Content: MDX files in `/content/posts/` (future phase)
- Hosting: Cloudflare Pages
- Interactive (later): Mapbox GL JS + react-map-gl, Giscus comments

## Token System

CSS custom properties are the source of truth. Tailwind references them via
`@theme` in `src/styles/global.css`. Theme toggle swaps vars via `data-theme` on `<html>`.

| CSS variable    | Tailwind utility                              | Role                        |
|-----------------|-----------------------------------------------|-----------------------------|
| `--canvas`      | `bg-canvas`                                   | main page background        |
| `--surface`     | `bg-surface`                                  | cards, code blocks, elevated|
| `--ink`         | `text-ink`                                    | primary text                |
| `--muted`       | `text-muted`                                  | secondary/subdued text      |
| `--accent`      | `text-accent`, `bg-accent`, `border-accent`   | purple #534AB7              |
| `--accent-mid`  | `text-accent-mid`                             | medium purple #AFA9EC       |
| `--accent-soft` | `bg-accent-soft`                              | lightest purple #EEEDFE     |

Placeholder color values (confirm visually before finalizing):
- Dark bg: `#0f0e13` — may want more purple tint
- Light bg: `#f5f4f0` — warm off-white

## Typography

- **Lora** (serif) — pullquotes, deep-mode signals
- **Source Sans 3** (sans) — everything else

## Visual Decisions

- Dark mode is primary/default
- Light mode: warm off-white background
- Theme toggle persists via `localStorage`, applied on `<html data-theme="...">`
