# Naviel — Site marketing

Site vitrine de **Naviel**, agence d'acquisition pour les entreprises locales
premium, basée à Paris (positionnement national). L'**automobile premium**
(detailing, PPF, covering, lavage haut de gamme) est la **vitrine phare** —
c'est là qu'on a des preuves chiffrées — et la même méthode est déclinée par
secteur (habitat & rénovation, beauté & esthétique, santé, artisanat & commerce
premium).

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

- `brandName`, `tagline`, `city` (siège), `coverage` (« Partout en France »), `areaServed` (SEO), `siteUrl`, `locale`
- `contact` : **e-mail**, **lien de réservation** (`bookingUrl`, ex. Cal.com), `phone` (click-to-call + CTA sticky), `whatsapp` (n° intl sans `+`), `formAccessKey` (clé [Web3Forms](https://web3forms.com) → active le formulaire de contact). Vide = la fonctionnalité est masquée proprement.
- `analytics` : `ga4Id`, `adsId`, `adsConversionLabel` — **vide = aucun tracking ni bandeau**. Renseigné = gtag.js + Consent Mode v2 (refus par défaut) + bandeau de consentement, et déclenchement de la conversion Google Ads sur `/merci`.
- `nav` : entrées de navigation (dont **Contact**)
- `signals` : signaux honnêtes (non chiffrés) affichés sur l'accueil
- `pricing` : ancrage « à partir de » sur `/offre` (montants éditables ; `enabled: false` ou montants vides → retour au « sur devis »)
- `reviews` : avis clients (section masquée si vide)
- `social` : réseaux sociaux (vide par défaut)
- `products` : produits maison du studio (page `/agence`) — `desc` vide = seul le nom s'affiche
- `founder` : `{ name, role, photo, bio }` (section « Derrière Naviel » sur `/agence`). **Tout champ vide n'affiche rien** — dépose la photo dans `/public` et référence-la (ex. `/founder.jpg`)
- `keywords` : mots-clés du marquee

> ⚠️ **Ne jamais inventer de statistiques ni de résultats clients** : si une
> donnée n'existe pas, retirez-la plutôt que d'afficher un faux chiffre. Les
> chiffres réels remplaceront les `signals` quand ils seront disponibles.

> Si vous changez `siteUrl`, mettez aussi à jour `SITE_URL` dans
> `astro.config.mjs` et l'URL du sitemap dans `public/robots.txt`.

### 2. Études de cas — `src/content/caseStudies/*.mdx`

Études de cas (100 % focus auto premium). Voir « Ajouter une étude de cas ».

### 3. Articles de blog — `src/content/blog/*.mdx`

Voir « Ajouter un article de blog ».

### 4. Secteurs — `src/config/site.ts` (`sectors`) + `src/content/sectors/*.mdx`

La liste `sectors` de `site.ts` pilote la grille de la home et le hub
`/secteurs`. Chaque secteur a une landing de conversion/SEO générée depuis la
content collection `sectors`. Voir « Ajouter un secteur ».

> Le drapeau `featured` met en avant la vitrine phare (auto premium). Le drapeau
> `hasProof` (dans la landing) affiche les réalisations : à ne mettre à `true`
> **que** pour un secteur où il existe de vrais cas clients.

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
  - { label: "Demandes / mois", value: "" }   # vide = non affiché
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

## Ajouter un secteur

1. Ajoutez l'entrée dans `sectors` de `src/config/site.ts` (pilote la grille
   home + le hub `/secteurs`) :

```ts
{ name: "Mon secteur", slug: "mon-secteur", featured: false, desc: "" }
```

2. Créez la landing `src/content/sectors/mon-secteur.mdx` (le `slug` = nom de
   fichier) :

```mdx
---
name: "Mon secteur"
title: "Plus de clients pour mon secteur"
summary: "Une phrase de résumé (hub + meta)."
eyebrow: "Sous-métiers · séparés · par des points"
featured: false
hasProof: false   # true uniquement s'il existe de vrais cas clients
keywords: ["mot-clé 1", "mot-clé 2"]
order: 6
---

Intro du secteur…

## Ce qu'on fait pour vous
…
```

La page `/secteurs/mon-secteur` est générée automatiquement et sert de landing
pour les campagnes Google Ads.

> ⚠️ Pour un secteur **sans réalisation**, laissez `hasProof: false` et
> n'affichez **aucun chiffre ni faux cas client** — présentez-le comme un
> « secteur accompagné ».

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

- [x] Lien de **réservation** branché (`contact.bookingUrl` — Cal.com).
- [x] **Captures réelles** des réalisations intégrées.
- [ ] Remplacer l'**e-mail** de contact si besoin.
- [ ] Renseigner de vrais **chiffres** (remplaceront les `signals`) + **métriques** des études de cas.
- [ ] Remplir le **fondateur** (`founder`) + déposer sa photo dans `/public`.
- [ ] Compléter les **descriptions** des produits maison (`products.desc`).
- [ ] Remplacer l'**image OG** (`public/og-default.png`) par un visuel définitif si souhaité.
- [ ] Compléter les **mentions légales** et la **confidentialité** (champs entre crochets).
- [ ] Renseigner `contact.phone` et `contact.whatsapp` (CTA sticky mobile + extensions d'appel Ads).
- [ ] Créer une clé **Web3Forms** → `contact.formAccessKey` (active le formulaire + redirection `/merci`).
- [ ] Pour Google Ads : renseigner `analytics.ga4Id`, `analytics.adsId`, `analytics.adsConversionLabel` (conversion déclenchée sur `/merci`).
- [ ] Collecter de vrais **avis clients** (preuve sociale = levier de conversion n°1).
- [ ] Vérifier `siteUrl` / `astro.config.mjs` / `robots.txt`.

---

## Accessibilité & performance

- Mobile-first, responsive, WCAG AA (focus visibles, navigation clavier, aria
  sur le menu mobile, lien d'évitement).
- `prefers-reduced-motion` respecté (animations neutralisées).
- Polices préchargées, images optimisées, ~0 JS client.
