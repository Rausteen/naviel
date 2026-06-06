/**
 * Configuration centralisée du site.
 * ───────────────────────────────────────────────────────────────────────────
 * Le propriétaire ne devrait avoir à modifier QUE ce fichier pour personnaliser
 * le nom de marque, la navigation, les coordonnées, les CTA, les stats, etc.
 *
 * NE JAMAIS inventer de statistiques ou de résultats clients.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Product {
  name: string;
  href: string;
  desc: string;
}

export interface Sector {
  name: string;
  slug: string;
  featured: boolean;
  desc: string;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  city: string;
  siteUrl: string;
  locale: string;
  lang: string;
  description: string;
  contact: {
    email: string;
    calendlyUrl: string;
    phone: string;
  };
  nav: NavItem[];
  stats: Stat[];
  social: SocialLink[];
  products: Product[];
  sectors: Sector[];
  keywords: string[];
}

export const site: SiteConfig = {
  brandName: "Naviel", // Nom de la marque (verrouillé)
  tagline: "On crée votre site et on vous amène des clients.",
  city: "Paris", // Siège — positionnement national
  siteUrl: "https://naviel.fr", // URL de prod (pour SEO/sitemap) — synchroniser avec astro.config.mjs
  locale: "fr_FR",
  lang: "fr",

  // Description SEO par défaut (utilisée si une page n'en fournit pas)
  description:
    "Agence d'acquisition pour les entreprises locales premium à Paris : sites sur-mesure, SEO local et Google Ads. On crée votre site et on vous amène des clients.",

  contact: {
    email: "contact@naviel.fr", // Remplacer si autre adresse
    calendlyUrl: "https://calendly.com/", // Lien de réservation à renseigner
    phone: "", // optionnel — laisser vide si non utilisé
  },

  nav: [
    { label: "Méthode", href: "/#methode" },
    { label: "Secteurs", href: "/secteurs" },
    { label: "Réalisations", href: "/realisations" },
    { label: "Offre", href: "/offre" },
    { label: "Agence", href: "/agence" },
  ],

  // Chiffres d'exemple — remplacer par de vrais chiffres ou retirer la stat.
  // NE JAMAIS inventer de statistiques.
  stats: [
    { value: "12+", label: "sites livrés & en production" },
    { value: "×3,2", label: "de demandes après refonte" },
    { value: "1ʳᵉ", label: "page Google sur les requêtes locales" },
    { value: "48h", label: "pour lancer une première campagne" },
  ],

  social: [], // ex. { label: "Instagram", href: "..." }

  // Produits développés en interne par le studio (page /agence uniquement).
  products: [
    { name: "jarvan.ai", href: "https://jarvan.ai", desc: "" },
    { name: "quizace.ai", href: "https://quizace.ai", desc: "" },
    { name: "revizly.app", href: "https://revizly.app", desc: "" },
  ],

  // Secteurs accompagnés. L'automobile premium est la vitrine phare (featured) :
  // c'est là qu'on a des preuves chiffrées. Pour les autres secteurs, aucun
  // chiffre ni faux cas client — ce sont des « secteurs accompagnés ».
  sectors: [
    {
      name: "Automobile premium",
      slug: "auto-premium",
      featured: true,
      desc: "Detailing, PPF, covering, lavage haut de gamme.",
    },
    {
      name: "Habitat & rénovation",
      slug: "habitat-renovation",
      featured: false,
      desc: "",
    },
    {
      name: "Beauté & esthétique",
      slug: "beaute-esthetique",
      featured: false,
      desc: "",
    },
    { name: "Santé", slug: "sante", featured: false, desc: "" },
    {
      name: "Artisanat & commerce premium",
      slug: "artisanat-premium",
      featured: false,
      desc: "",
    },
  ],

  // Mots-clés (secteurs) affichés dans le marquee
  keywords: [
    "Auto premium",
    "Habitat & rénovation",
    "Beauté & esthétique",
    "Santé",
    "Artisanat premium",
    "Commerce local",
  ],
};

export default site;
