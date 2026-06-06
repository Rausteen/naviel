# Audit complet — naviel.fr

> Audit réalisé sur le code et le build généré (`dist/`). **Aucune correction appliquée** : ce document est un rapport priorisé.
> Date : 2026-06-06 · Branche : `claude/stoic-hopper-RIZTU`

## Méthode & commandes lancées

| Commande | Résultat |
|---|---|
| `pnpm build` (astro check + build) | ✅ **0 erreur, 0 warning** · 37 pages générées |
| `pnpm exec astro check` | ✅ 52 fichiers : **0 erreur / 0 warning / 0 hint** |
| `pnpm audit` | ⚠️ **3 vulnérabilités** : 1 low, 2 moderate (voir 🟠) |
| Vérif liens internes (script Python sur `dist/`) | ✅ 40 liens internes, **0 cible manquante** |
| Vérif fichiers (sitemap, robots, OG, favicon, founder, 404) | ✅ tous présents |
| Inspection HTML `dist/` (h1, title, meta, alt, JSON-LD, OG, noopener) | voir détails |
| `sharp` metadata (OG, founder) | OG 1200×630 ✓ · founder PNG 440×520 (108 K) |
| `npx lighthouse --version` | ✅ 13.3.0 récupérable |
| `npx @puppeteer/browsers install chrome-headless-shell` | ❌ **échec** (téléchargement binaire bloqué) |

> ⚠️ **Lighthouse, pa11y et axe n'ont PAS pu être exécutés** : aucun binaire Chrome/Chromium dans l'environnement et l'installation d'un Chrome headless est bloquée (réseau). Les volets **Performance** et **Accessibilité** sont donc évalués **par analyse du code et du build** (très fiable mais non chiffré). **À relancer sur l'URL déployée.**

---

## 🔴 Critique

### 1. Aucune mesure / tracking en place — bloquant pour une agence qui vend du Google Ads
- **Où** : `src/config/site.ts` → `analytics: { ga4Id:"", adsId:"", adsConversionLabel:"", gscVerification:"" }` (tout vide).
- **Quoi** : aucun analytics actif (GA4/Plausible), aucune balise de conversion Google Ads, et **le clic sur « Réserver un appel » (lien cal.com externe) n'est pas suivi comme conversion**. La page `/merci` (point de conversion prévu) ne se déclenche que via le formulaire, lui-même désactivé (pas de clé Web3Forms).
- **Pourquoi** : sans mesure, impossible d'optimiser l'acquisition ni de piloter des campagnes Ads au ROI — c'est le cœur du métier vendu.
- **Corriger** : renseigner `ga4Id` + `adsId` + `adsConversionLabel` ; ajouter un **event de conversion sur le clic des CTA de réservation** (ex. `gtag('event','generate_lead')` au clic, ou via `/merci`). Le bandeau Consent Mode v2 est déjà câblé et s'activera automatiquement.

### 2. Statistiques inventées affichées sur l'accueil
- **Où** : `src/config/site.ts` → `stats` ; rendu via `StatGrid` sur `/` (« 12+ sites livrés & en production », « ×3,2 de demandes après refonte », « Top 1 sur des dizaines de requêtes », « 48h pour lancer une campagne »).
- **Quoi** : chiffres non étayés.
- **Pourquoi** : contredit le principe « aucune statistique inventée » **et** expose à un **refus Google Ads** (politique « déclarations trompeuses »), en plus du risque de crédibilité.
- **Corriger** : remplacer par de vrais chiffres mesurés, ou repasser sur la **barre de signaux honnêtes** (déjà présente en config : `signals`).

### 3. Fausses preuves : témoignages + métriques d'études de cas inventés
- **Où** :
  - Témoignages `src/config/site.ts` → `reviews` (« Karim B. », « Thomas R. », « Julie M. ») rendus sur `/` (section Avis).
  - Métriques `src/content/caseStudies/ppf-strasbourg.mdx` (×2,4 / Top 3 / 98/100) et `strasclean.mdx` (300+ / « des dizaines » / 99/100), reprises dans le hero (« ×2,4 demandes de devis », « 300+ pages en première page ») et les pages SEO local.
- **Quoi** : avis et chiffres non réels (ajoutés précédemment sur demande, mais non conformes au principe « aucune fausse preuve / aucun faux cas client »).
- **Pourquoi** : risque juridique (faux avis = pratique commerciale trompeuse en France), de crédibilité, et de **refus/​suspension Google Ads**.
- **Corriger** : remplacer par de **vrais** avis (idéalement liés à la fiche Google) et de **vraies** métriques mesurées ; sinon **retirer**. Garder la même exigence sur le hero et `/seo-local`.

---

## 🟠 Important

### 4. Vulnérabilités de dépendances (`pnpm audit`)
- **Quoi** : 2 modérées — *yaml* (stack overflow sur YAML profondément imbriqué, transitif) et **Astro : XSS dans `define:vars` via balise `</script>` incomplète** ; 1 faible — *Astro server island*. Astro **5.18.2**, corrigé en **≥ 6.1.10**.
- **Où** : `package.json` (`astro ^5.8`). `define:vars` est utilisé dans `src/components/Analytics.astro` et `src/pages/merci.astro`, mais **avec des valeurs de configuration (pas d'entrée utilisateur)** → risque réel faible. Les *server islands* ne sont pas utilisées (sortie statique).
- **Corriger** : planifier la montée vers **Astro 6** (version majeure → tester) ; en attendant, ne pas injecter de contenu non maîtrisé dans `define:vars`.

### 5. Aucun en-tête de sécurité HTTP
- **Où** : `server.mjs` ne pose que `X-Content-Type-Options: nosniff` et `Cache-Control` ; aucun **CSP, HSTS, Referrer-Policy, X-Frame-Options/Permissions-Policy**.
- **Pourquoi** : best practices / score « Best Practices » Lighthouse, protection clickjacking & sniffing.
- **Corriger** : ajouter ces en-têtes au **reverse proxy (Dokploy/Traefik)** ou dans `server.mjs`. Penser à autoriser dans la CSP : cal.com (iframe), googletagmanager/google-analytics (si tracking), web3forms (si formulaire).

### 6. Click-to-call & WhatsApp absents
- **Où** : `src/config/site.ts` → `contact.phone:""`, `contact.whatsapp:""`. La barre CTA sticky mobile n'affiche donc que « Réserver ».
- **Pourquoi** : sur trafic mobile/Ads local, **l'appel et WhatsApp sont des convertisseurs majeurs** ; tes références (ppf-strasbourg, strasclean) convertissent massivement via WhatsApp. Débloque aussi les extensions d'appel Google Ads.
- **Corriger** : renseigner `phone` (format `+33…`) et `whatsapp` (`33…`). Le lien `wa.me/<digits>` est généré correctement par `StickyCTA.astro` (format valide).

### 7. Titres `<title>` trop longs (tronqués en SERP)
- **Où** : 12 pages entre **72 et 81 caractères** (suffixe « — Naviel » inclus). Ex. : `blog/combien-coute-site-internet-artisan` (81), `secteurs/sante` (80), `secteurs/habitat-renovation` (78), `creation-site/barbier` (78).
- **Pourquoi** : Google tronque ~60 caractères → perte de lisibilité/CTR.
- **Corriger** : raccourcir les `seoTitle` (cible ≤ 60), ou retirer le suffixe « — Naviel » sur les pages au titre déjà long.

### 8. Meta descriptions trop longues
- **Où** : 9 pages entre **162 et 204 caractères**. Ex. : `secteurs/index` (204), `index` (194), `agence` (187), `offre` (180), `methode` (178).
- **Pourquoi** : tronquées (~155-160 car.) en SERP.
- **Corriger** : raccourcir à ~150-155 caractères, en gardant l'accroche + le bénéfice en tête.

---

## 🟡 Mineur

### 9. Performance & accessibilité non mesurées (Lighthouse/pa11y indisponibles)
- **À faire** : relancer sur l'URL déployée — `npx lighthouse <url> --preset=desktop` et mobile ; `npx pa11y <url>` / axe sur `/`, une page secteur, une étude de cas. Les indices code sont **excellents** (voir ✅) mais doivent être confirmés et chiffrés.

### 10. Terminologie « premium » résiduelle (positionnement)
- **Où** : noms de secteurs **« Immobilier premium »** et **« Artisanat & commerce premium »** (`src/config/site.ts` + MDX) ; formules « autres **secteurs premium** » (`/agence`, `/`). Pilier `/creation-site-internet-paris` : « Un site **premium** » (qualifie la méthode → acceptable).
- **Pourquoi** : le positionnement validé qualifie les clients d'« artisans et entreprises de service » ; « premium » ne doit qualifier que la **méthode**, pas les segments clients. « Automobile premium » reste OK (endossé par le brief).
- **Corriger** : renommer « Immobilier premium » → « Immobilier », « Artisanat & commerce premium » → « Artisanat & commerce » ; remplacer « autres secteurs premium » par « autres secteurs ».

### 11. Photo fondateur hors pipeline d'images
- **Où** : `src/pages/agence.astro` utilise `<img src={site.founder.photo}>` (fichier `public/founder.png`, **PNG 108 K**), pas `astro:assets`.
- **Pourquoi** : pas de conversion WebP/AVIF ni de `srcset`. Impact faible (image sous la ligne de flottaison, `loading="lazy"`, `width/height` fixés → pas de CLS).
- **Corriger** : fournir un WebP, ou passer la photo par `<Image>` (nécessite un import statique, donc un chemin connu plutôt qu'une string de config).

### 12. Polices différentes du brief
- **Quoi** : le brief mentionne **Bricolage Grotesque + Hanken Grotesk**, mais le site utilise **Space Grotesk + Manrope** (changé sur demande ultérieure). Préchargées + `font-display: swap` (pas de FOIT).
- **Corriger** : rien si c'est voulu — simplement **confirmer** que c'est le choix retenu.

### 13. Page Paris — cohérence « SEO local »
- **Où** : `/creation-site-internet-paris` (« SEO local Paris »). C'est une **landing locale légitime** (clients à Paris), mais veiller à ce que le discours **générique** reste « votre ville » (c'est bien le cas ailleurs : home, secteurs, métiers ciblent « votre ville/métier »).
- **Corriger** : rien d'urgent ; surveiller à mesure que d'autres pages villes seraient ajoutées (éviter le city-lock global).

### 14. Bio fondateur à confirmer
- **Où** : `src/config/site.ts` → `founder.bio` (« J'ai lancé Naviel après des années à concevoir des sites… »).
- **Pourquoi** : contenu plausible mais non vérifié (pas de placeholder visible, donc pas bloquant).
- **Corriger** : valider l'exactitude de la bio.

### 15. Responsive non vérifié visuellement
- **Quoi** : pas de navigateur dans l'environnement → rendu 360/768/1280 non testé visuellement. Les classes responsives sont en place (grilles qui s'empilent, secteurs 2 colonnes mobile, `overflow-x: hidden` global de sécurité, CTA sticky, burger 44 px).
- **Corriger** : valider sur appareils réels (notamment hero, grille secteurs, cartes tarifs, page contact / iframe cal.com).

---

## ✅ Ce qui est bien

- **Build sain** : `astro check` 0/0/0, build 0 erreur / 0 warning, 37 pages.
- **Performance (indices code)** : **0 JS externe** (uniquement 6 petits scripts inline), 1 feuille CSS (~48 K max non gzippé), **polices préchargées + `font-display: swap`**, images via `astro:assets` (WebP, `width`/`height` → pas de CLS) sauf la photo fondateur.
- **SEO on-page** : **1 seul `<h1>` par page**, **titres uniques** (aucun doublon), **meta description sur toutes les pages**, `canonical`, Open Graph + Twitter complets, `lang="fr"`.
- **Données structurées** : `ProfessionalService` (adresse Paris + `areaServed` France) + `Organization` + `FAQPage` **dans le `<head>`** ; `BreadcrumbList` + `Service` sur pages internes, `Article` sur blog & études de cas.
- **Indexabilité** : `sitemap-index.xml` (33 URLs, dont `/secteurs/*`, `/realisations/*`, `/blog/*`, `/creation-site/*`), `robots.txt` valide référençant le sitemap, **pages noindex exclues** (merci, légales).
- **Liens** : **0 lien interne cassé** (40 vérifiés), **0 lien externe `target=_blank` sans `noopener`**.
- **Conversion** : **tous les CTA pointent vers le vrai lien cal.com** (`site.contact.bookingUrl`), **aucun `calendly.com` en dur**, embed cal.com inline sur `/contact`, `/contact` présent en nav **et** footer.
- **Contenu** : **aucun « À REMPLACER » visible**, aucun texte lorem/placeholder, français correct, ton cohérent.
- **Config centralisée réellement utilisée** : email, ville, lien de réservation, `founder`, `sectors`, `products` — **aucune valeur en dur** dans les pages.
- **Accessibilité (revue code)** : skip link, `:focus-visible` (outline accent), `aria-expanded` sur le menu mobile, landmarks `header/nav/main/footer`, **`prefers-reduced-motion` respecté** (reveals + marquee neutralisés), contrastes AA OK (texte `muted` ≈ 5:1 ; texte sur accent ≈ 15:1 ; `ink`/`ink-soft` très élevés).
- **Géo cohérente** : « basé à Paris » + « partout en France », pas de city-lock hors page Paris dédiée ; le SEO vendu cible « votre ville ».
- **Architecture** : content collections typées (`caseStudies`, `blog`, `sectors`, `verticales`), composants réutilisables (Pricing, CaseStudyCard, SectorCard…), page **404 personnalisée**.

---

## Plan d'action ordonné

1. **🔴 Retirer / remplacer les fausses preuves** (stats accueil, témoignages, métriques d'études de cas) par du réel mesuré, ou les masquer — **prioritaire avant toute diffusion Google Ads**.
2. **🔴 Brancher la mesure** : GA4 + balise conversion Google Ads + **event sur le clic « Réserver »** ; vérifier la chaîne `/merci`. (Consent Mode v2 déjà prêt.)
3. **🟠 Renseigner `phone` + `whatsapp`** (active appel + WhatsApp dans la barre sticky et débloque les extensions d'appel Ads).
4. **🟠 Raccourcir les `seoTitle` (>60) et meta descriptions (>160)** sur les ~12/9 pages concernées.
5. **🟠 Ajouter les en-têtes de sécurité** (CSP, HSTS, Referrer-Policy, X-Frame-Options) au proxy/serveur.
6. **🟠 Traiter les vulnérabilités** : planifier la montée Astro 6 (tester), surveiller `define:vars`.
7. **🟡 Nettoyer la terminologie « premium »** sur les noms de secteurs et formules génériques.
8. **🟡 Optimiser la photo fondateur** (WebP / `<Image>`).
9. **🟡 Lancer Lighthouse (mobile+desktop) et pa11y** sur l'URL déployée ; corriger les éventuels écarts.
10. **🟡 Vérifier le responsive** sur appareils réels (360 / 768 / 1280).

---

## Résumé

- 🔴 Critique : **3**
- 🟠 Important : **5**
- 🟡 Mineur : **7**
- ✅ Points forts : nombreux (build sain, perf code excellente, SEO technique solide, conversion bien câblée, config centralisée).

**Scores Lighthouse** : ⚠️ **non disponibles** — Chrome/Chromium absent de l'environnement et installation d'un Chrome headless bloquée. À exécuter sur l'URL de production :
`npx lighthouse https://naviel.fr --preset=desktop` puis en mobile, sur l'accueil + une page secteur + une étude de cas.
