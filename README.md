# Naviel — Site marketing

Site vitrine de **Naviel**, agence d'acquisition spécialisée pour l'automobile
premium (detailing, PPF, covering, lavage haut de gamme) à Strasbourg.

> Positionnement : « On crée votre site **et** on vous amène des clients. »
> Ce site est la principale vitrine de l'agence : la qualité de design et les
> performances sont elles-mêmes la preuve du savoir-faire.

---

## Stack

- **[Astro](https://astro.build)** (sortie statique) — ~0 JS par défaut, parfait
  pour le SEO et la performance.
- **TypeScript** partout, props de composants typées.
- **Tailwind CSS v4** (via `@tailwindcss/vite`) + variables CSS (design tokens).
- **Content Collections** (MDX) pour les études de cas et le blog.
- Polices auto-hébergées via `@fontsource` (pas d'appel Google Fonts → perf + RGPD).
- Images optimisées via `astro:assets` (`<Image>`, formats modernes, lazy-loading).
- `@astrojs/sitemap` + `robots.txt` + JSON-LD pour le SEO.

---

## Prérequis

- **Node.js ≥ 18.20** (recommandé : Node 20 ou 22).
- **pnpm** (recommandé) — ou `npm`.

---

## Commandes

```bash
pnpm install      # installer les dépendances
pnpm dev          # serveur de développement (http://localhost:4321)
pnpm build        # build de production (astro check + astro build → dist/)
pnpm preview      # prévisualiser le build de production
```

> Avec npm : remplacer `pnpm` par `npm run` (ex. `npm run dev`).

---

## Où éditer le contenu

### 1. Configuration centralisée — `src/config/site.ts`

**Le fichier le plus important.** Tout ce qui est éditable s'y trouve :

- `brandName`, `tagline`, `city`, `siteUrl`, `locale`
- `contact` : **e-mail**, **lien Calendly** (`calendlyUrl`), téléphone (optionnel)
- `nav` : entrées de navigation
- `stats` : chiffres clés affichés sur l'accueil
- `social` : réseaux sociaux (vide par défaut)
- `products` : produits maison du studio (page `/agence`)
- `keywords` : mots-clés du marquee

> ⚠️ Les éléments marqués `// À REMPLACER` doivent être renseignés avant la mise
> en ligne. **Ne jamais inventer de statistiques ni de résultats clients** : si
> une donnée n'existe pas, retirez-la plutôt que d'afficher un faux chiffre.

> Si vous changez `siteUrl`, mettez aussi à jour `SITE_URL` dans
> `astro.config.mjs` et l'URL du sitemap dans `public/robots.txt`.

### 2. Études de cas — `src/content/caseStudies/*.mdx`

Études de cas (100 % focus auto premium). Voir « Ajouter une étude de cas ».

### 3. Articles de blog — `src/content/blog/*.mdx`

Voir « Ajouter un article de blog ».

---

## Ajouter une étude de cas

1. Ajoutez un visuel de couverture dans `src/assets/case-studies/`.
2. Créez `src/content/caseStudies/mon-projet.mdx` :

```mdx
---
title: "Titre de l'étude de cas"
client: "Nom du client"
secteur: "PPF · Covering"
year: 2024
url: "https://exemple.fr"
cover: "../../assets/case-studies/mon-projet.png"
summary: "Une phrase de résumé."
metrics:
  - { label: "Demandes / mois", value: "À REMPLACER" }
services:
  - "Site sur-mesure"
  - "SEO local"
featured: true
order: 3
---

## Contexte / problème
…

## Ce qu'on a fait
…

## Résultats
…
```

La page `/realisations/mon-projet` est générée automatiquement, et la carte
apparaît sur `/realisations` (triée par `order`) et dans le teaser de l'accueil.

> Les **produits maison** du studio (jarvan.ai, etc.) ne doivent **jamais**
> apparaître dans les études de cas — ils vivent uniquement sur `/agence`.

---

## Ajouter un article de blog

1. (Optionnel) Ajoutez une couverture dans `src/assets/blog/`.
2. Créez `src/content/blog/mon-article.mdx` :

```mdx
---
title: "Titre de l'article"
description: "Description SEO (méta)."
date: 2026-02-01
author: "Naviel"
cover: "../../assets/blog/mon-article.png"
tags: ["SEO", "Detailing"]
draft: false
---

Contenu de l'article…
```

Mettez `draft: true` pour masquer un article tant qu'il n'est pas prêt.

---

## Images placeholder

Des visuels de marque temporaires sont générés par
`scripts/gen-placeholders.mjs` (couvertures d'études de cas, image OG, cover
blog). **À remplacer par de vrais visuels / captures avant la mise en ligne.**

```bash
node scripts/gen-placeholders.mjs   # régénère les placeholders
```

---

## Déploiement

Sortie statique (`output: 'static'`) → déployable partout.

### Vercel

- Importez le dépôt. Framework détecté : **Astro**.
- Build : `pnpm build` · Output : `dist`.

### Netlify

- Build command : `pnpm build` · Publish directory : `dist`.

> Pensez à régler `siteUrl` (config), `astro.config.mjs` et `robots.txt` sur le
> domaine de production avant le déploiement.

---

## Checklist avant mise en ligne

- [ ] Remplacer le lien **Calendly** (`contact.calendlyUrl`).
- [ ] Remplacer l'**e-mail** de contact si besoin.
- [ ] Remplacer les **stats** par de vrais chiffres (ou les retirer).
- [ ] Remplacer les **métriques** des études de cas.
- [ ] Remplacer les **captures** des réalisations et l'**image OG**.
- [ ] Compléter les **descriptions** des produits maison (`products`).
- [ ] Compléter les **mentions légales** et la **politique de confidentialité**.
- [ ] Vérifier `siteUrl` / `astro.config.mjs` / `robots.txt`.

---

## Accessibilité & performance

- Mobile-first, responsive, WCAG AA (focus visibles, navigation clavier, aria
  sur le menu mobile, lien d'évitement).
- `prefers-reduced-motion` respecté (animations neutralisées).
- Polices préchargées, images optimisées, ~0 JS client.
