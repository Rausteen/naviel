/**
 * Configuration centralisée du site.
 * ───────────────────────────────────────────────────────────────────────────
 * Le propriétaire ne devrait avoir à modifier QUE ce fichier pour personnaliser
 * le nom de marque, la navigation, les coordonnées, les CTA, les signaux, etc.
 *
 * NE JAMAIS inventer de statistiques ou de résultats clients.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Product {
  name: string;
  href: string;
  desc: string; // 1 ligne. Si vide → seul le nom est affiché.
}

export interface Stat {
  value: string;
  label: string;
}

export interface Sector {
  name: string;
  slug: string;
  featured: boolean;
  desc: string;
}

export interface Founder {
  name: string;
  role: string;
  photo: string; // chemin depuis /public (ex. "/founder.jpg"). Vide → masqué.
  bio: string;
}

export interface Analytics {
  ga4Id: string; // ex. "G-XXXXXXXXXX" — vide = aucun tracking, aucun bandeau
  adsId: string; // ex. "AW-XXXXXXXXXX"
  adsConversionLabel: string; // ex. "abcdEFGhIJ" (conversion sur /merci)
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  city: string;
  coverage: string;
  areaServed: string;
  siteUrl: string;
  locale: string;
  lang: string;
  description: string;
  contact: {
    email: string;
    bookingUrl: string;
    phone: string; // ex. "+33 6 12 34 56 78" — vide = bouton Appeler masqué
    whatsapp: string; // numéro intl sans + ni espaces, ex. "33612345678" — vide = masqué
    formAccessKey: string; // clé Web3Forms — vide = formulaire masqué (fallback Cal.com)
  };
  analytics: Analytics;
  nav: NavItem[];
  stats: Stat[];
  signals: string[];
  social: SocialLink[];
  products: Product[];
  sectors: Sector[];
  founder: Founder;
  keywords: string[];
}

export const site: SiteConfig = {
  brandName: "Naviel", // Nom de la marque (verrouillé)
  tagline: "On crée votre site et on vous amène des clients.",
  city: "Paris", // Siège
  coverage: "Partout en France", // Zone couverte (clients à distance)
  areaServed: "France", // Pour le SEO / JSON-LD
  siteUrl: "https://naviel.fr", // URL de prod (SEO/sitemap) — synchroniser avec astro.config.mjs
  locale: "fr_FR",
  lang: "fr",

  // Description SEO par défaut (utilisée si une page n'en fournit pas)
  description:
    "Agence d'acquisition pour les entreprises de service premium, basée à Paris, partout en France : sites sur-mesure, SEO local et Google Ads. On crée votre site et on vous amène des clients.",

  contact: {
    email: "contact@naviel.fr", // Remplacer si autre adresse
    bookingUrl: "https://cal.com/naviel/appel-decouverte", // Lien de réservation (Cal.com)
    phone: "", // ex. "+33 6 12 34 56 78" — vide = bouton Appeler masqué
    whatsapp: "", // ex. "33612345678" (intl, sans + ni espaces) — vide = masqué
    formAccessKey: "", // clé Web3Forms (https://web3forms.com) — vide = formulaire masqué
  },

  // Tracking — INACTIF tant que les IDs sont vides (aucun script, aucun bandeau).
  // Quand renseigné : gtag.js + Consent Mode v2 (refus par défaut) + bandeau.
  analytics: {
    ga4Id: "",
    adsId: "",
    adsConversionLabel: "",
  },

  nav: [
    { label: "Méthode", href: "/methode" },
    { label: "Secteurs", href: "/secteurs" },
    { label: "Réalisations", href: "/realisations" },
    { label: "Offre", href: "/offre" },
    { label: "Agence", href: "/agence" },
    { label: "Contact", href: "/contact" },
  ],

  // Chiffres clés affichés sur l'accueil.
  // ⚠️ DÉMO — valeurs de démonstration à remplacer par de vrais chiffres
  // mesurés avant d'attirer du trafic réel.
  stats: [
    { value: "12+", label: "sites livrés & en production" },
    { value: "×3,2", label: "de demandes après refonte" },
    { value: "1ʳᵉ", label: "page Google sur les requêtes locales" },
    { value: "48h", label: "pour lancer une première campagne" },
  ],

  // Signaux honnêtes (NON chiffrés) — disponibles si tu veux les réafficher.
  signals: [
    "Design + SEO + Ads sous un même toit",
    "Sur-mesure, zéro template",
    "Basés à Paris, partout en France",
    "Devis clair et ferme · le site vous appartient",
  ],

  social: [], // ex. { label: "Instagram", href: "..." }

  // Produits développés en interne par le studio (page /agence uniquement).
  // desc : 1 ligne. Si vide → seul le nom est affiché (jamais de placeholder).
  products: [
    {
      name: "jarvan.ai",
      href: "https://jarvan.ai",
      desc: "Copilote IA pour Google Ads : il crée les campagnes, traque le budget gaspillé et soumet chaque optimisation à votre validation.",
    },
    {
      name: "quizace.ai",
      href: "https://quizace.ai",
      desc: "Assistant de révision en extension Chrome : une réponse claire et expliquée directement sur la page, sur les principales plateformes.",
    },
    {
      name: "revizly.app",
      href: "https://revizly.app",
      desc: "L'IA de révision : un cours déposé devient fiches, flashcards et quiz prêts à apprendre. Plus de 50 000 étudiants.",
    },
  ],

  // Secteurs accompagnés. L'automobile premium est la vitrine phare (featured) :
  // c'est là qu'on a des preuves. Pour les autres : aucun chiffre, aucun faux cas.
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
    {
      name: "Immobilier premium",
      slug: "immobilier-premium",
      featured: false,
      desc: "",
    },
  ],

  // Fondateur (section « Derrière Naviel » sur /agence).
  // Tout champ vide n'affiche RIEN (aucun placeholder visible).
  // ⚠️ DÉMO — informations de démonstration à remplacer.
  founder: {
    name: "Nathan",
    role: "Fondateur · Naviel",
    photo: "/founder.png", // déposer une vraie photo dans /public (remplace le placeholder)
    bio: "J'ai lancé Naviel après des années à concevoir des sites et piloter des campagnes d'acquisition pour des entreprises premium. Le constat : trop d'agences livrent un beau site et disparaissent. Chez Naviel, vous parlez directement à l'expert qui conçoit votre site, le référence et amène les clients — du premier appel jusqu'aux résultats.",
  },

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
