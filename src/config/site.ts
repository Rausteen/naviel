/**
 * Configuration centralisée du site.
 * ───────────────────────────────────────────────────────────────────────────
 * Le propriétaire ne devrait avoir à modifier QUE ce fichier pour personnaliser
 * le nom de marque, la navigation, les coordonnées, les CTA, les stats, etc.
 *
 * Tout ce qui est marqué « À REMPLACER » doit être renseigné avant la mise en
 * ligne. NE JAMAIS inventer de statistiques ou de résultats clients.
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
  keywords: string[];
}

export const site: SiteConfig = {
  brandName: "Naviel", // Nom de l'agence (verrouillé)
  tagline: "On crée votre site et on vous amène des clients.",
  city: "Strasbourg",
  siteUrl: "https://naviel.fr", // URL de prod (pour SEO/sitemap) — synchroniser avec astro.config.mjs
  locale: "fr_FR",
  lang: "fr",

  // Description SEO par défaut (utilisée si une page n'en fournit pas)
  description:
    "Agence d'acquisition spécialisée pour l'automobile premium à Strasbourg : detailing, PPF, covering, lavage haut de gamme. On crée votre site sur-mesure et on vous amène des clients via le SEO et la publicité.",

  contact: {
    email: "contact@naviel.fr", // À REMPLACER si autre adresse
    calendlyUrl: "https://calendly.com/", // À REMPLACER (lien de réservation)
    phone: "", // optionnel — laisser vide si non utilisé
  },

  nav: [
    { label: "Méthode", href: "/#methode" },
    { label: "Réalisations", href: "/realisations" },
    { label: "Offre", href: "/offre" },
    { label: "Agence", href: "/agence" },
  ],

  // À REMPLACER par de vrais chiffres — NE JAMAIS inventer de statistiques.
  // Si une donnée n'existe pas encore, RETIRER la stat plutôt qu'afficher un faux chiffre.
  stats: [
    { value: "12+", label: "sites livrés & en production" },
    { value: "×3,2", label: "de demandes après refonte" },
    { value: "1ʳᵉ", label: "page Google sur les requêtes locales" },
    { value: "48h", label: "pour lancer une première campagne" },
  ],

  social: [], // ex. { label: "Instagram", href: "..." }

  // Produits développés en interne par le studio (page /agence uniquement).
  // descriptions « À REMPLACER » — ne pas inventer le positionnement.
  products: [
    { name: "jarvan.ai", href: "https://jarvan.ai", desc: "À REMPLACER" },
    { name: "quizace.ai", href: "https://quizace.ai", desc: "À REMPLACER" },
    { name: "revizly.app", href: "https://revizly.app", desc: "À REMPLACER" },
  ],

  // Secteurs / mots-clés affichés dans le marquee
  keywords: [
    "PPF",
    "Detailing",
    "Covering",
    "Céramique",
    "Lavage premium",
    "Carrosserie",
  ],
};

export default site;
