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
    calendlyUrl: string;
    phone: string;
  };
  nav: NavItem[];
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
  coverage: "Partout en France", // Zone d'intervention
  areaServed: "France", // Pour le SEO / JSON-LD
  siteUrl: "https://naviel.fr", // URL de prod (SEO/sitemap) — synchroniser avec astro.config.mjs
  locale: "fr_FR",
  lang: "fr",

  // Description SEO par défaut (utilisée si une page n'en fournit pas)
  description:
    "Agence d'acquisition pour les entreprises de service premium, basée à Paris, partout en France : sites sur-mesure, SEO local et Google Ads. On crée votre site et on vous amène des clients.",

  contact: {
    email: "contact@naviel.fr", // Remplacer si autre adresse
    calendlyUrl: "https://calendly.com/nathanabib07/30min", // Lien de réservation
    phone: "", // optionnel — laisser vide si non utilisé
  },

  nav: [
    { label: "Méthode", href: "/#methode" },
    { label: "Secteurs", href: "/secteurs" },
    { label: "Réalisations", href: "/realisations" },
    { label: "Offre", href: "/offre" },
    { label: "Agence", href: "/agence" },
    { label: "Contact", href: "/contact" },
  ],

  // Signaux honnêtes (NON chiffrés). Remplacer par de vrais chiffres seulement
  // quand ils existent — ne jamais inventer de statistiques.
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
  ],

  // Fondateur (section « Derrière Naviel » sur /agence).
  // Tout champ vide n'affiche RIEN (aucun placeholder visible).
  founder: {
    name: "",
    role: "",
    photo: "", // ex. "/founder.jpg" (déposer le fichier dans /public)
    bio: "",
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
