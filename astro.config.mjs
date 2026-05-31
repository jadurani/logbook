// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  site: 'https://rani.ph',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), sitemap(), react(), ...(isDev ? [keystatic()] : [])],
});
