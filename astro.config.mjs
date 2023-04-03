import { defineConfig } from 'astro/config';
import { settings } from './src/data/settings';
import sitemap from "@astrojs/sitemap";
import robotsTxt from 'astro-robots-txt';
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: settings.site,
  integrations: [sitemap(), robotsTxt(), mdx()],
  vite: {
    ssr: {
      external: ["svgo"]
    }
  }
});