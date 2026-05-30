// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  site: 'https://rani.ph',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), sitemap(), react(), keystatic()],
});
