// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

// URL de prod — doit rester synchronisée avec src/config/site.ts (siteUrl)
const SITE_URL = "https://naviel.fr";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "ignore",
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "fr",
        locales: { fr: "fr-FR" },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Autorise les images distantes éventuelles (OG, captures) si besoin
    domains: [],
  },
});
