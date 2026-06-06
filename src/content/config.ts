import { defineCollection, z } from "astro:content";

/**
 * Études de cas — 100 % focus automobile premium.
 * Les produits maison du studio (jarvan.ai, etc.) NE doivent jamais
 * apparaître ici : ils vivent uniquement dans la page /agence.
 */
const caseStudies = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      secteur: z.string(), // ex. "PPF · Covering"
      year: z.number(),
      url: z.string().url(), // site du client
      cover: image(), // visuel
      summary: z.string(), // 1 phrase
      // métriques en placeholders, à remplacer par de vrais chiffres
      metrics: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          }),
        )
        .default([]),
      services: z.array(z.string()).default([]), // ex. ["Site sur-mesure", "SEO local"]
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

/**
 * Blog — contenu SEO.
 */
const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      author: z.string().default("Naviel"),
      cover: image().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

/**
 * Secteurs — landings de conversion / SEO par métier (servent aux campagnes Ads).
 * L'automobile premium est la vitrine phare (hasProof: true). Pour les autres
 * secteurs : aucun chiffre, aucun faux cas client — « secteurs accompagnés ».
 */
const sectors = defineCollection({
  type: "content",
  schema: () =>
    z.object({
      name: z.string(), // ex. "Automobile premium"
      title: z.string(), // titre H1 de la landing
      summary: z.string(), // 1 phrase (hub + meta)
      eyebrow: z.string().optional(),
      featured: z.boolean().default(false),
      hasProof: z.boolean().default(false), // true uniquement si réalisations réelles
      keywords: z.array(z.string()).default([]),
      order: z.number().default(0),
    }),
});

export const collections = { caseStudies, blog, sectors };
