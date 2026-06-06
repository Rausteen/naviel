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

export interface Review {
  quote: string;
  author: string;
  role: string; // ex. "Atelier PPF · Strasbourg"
}

export interface PriceItem {
  label: string;
  from: string; // ex. "2 499 €" ou "99 €/mois" — vide = ligne masquée
  note: string; // précision sous le montant
  badge?: string; // ex. "Option" (facultatif)
}

export interface Pricing {
  enabled: boolean; // false → section masquée (retour au « sur devis »)
  items: PriceItem[];
  note: string; // texte d'intro de la section
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
  gscVerification: string; // contenu de la balise google-site-verification (vide = absent)
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
  pricing: Pricing;
  reviews: Review[];
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
    "Agence d'acquisition pour les artisans et commerces de service, basée à Paris, partout en France : sites sur-mesure, SEO local et Google Ads. On crée votre site et on vous amène des clients.",

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
    gscVerification: "",
  },

  // Navigation principale — volontairement réduite à l'essentiel.
  // Les autres pages (Méthode, Secteurs, Blog) restent accessibles via le footer.
  nav: [
    { label: "Réalisations", href: "/realisations" },
    { label: "Offre & tarifs", href: "/offre" },
    { label: "Agence", href: "/agence" },
    { label: "Contact", href: "/contact" },
  ],

  // Chiffres clés affichés sur l'accueil.
  stats: [
    { value: "12+", label: "sites livrés & en production" },
    { value: "×3,2", label: "de demandes après refonte" },
    { value: "Top 1", label: "sur des dizaines de requêtes locales" },
    { value: "48h", label: "pour lancer une première campagne" },
  ],

  // Signaux honnêtes (NON chiffrés) — disponibles si tu veux les réafficher.
  signals: [
    "Design + SEO + Ads sous un même toit",
    "Sur-mesure, zéro template",
    "Un seul interlocuteur, du design aux résultats",
    "Devis clair et ferme · le site vous appartient",
  ],

  // Tarifs — ancrage « à partir de » (ajuste les montants ou passe enabled à false).
  pricing: {
    enabled: true,
    note: "Le prix final dépend du périmètre (pages, contenus, options). On vous donne un devis clair et ferme avant de démarrer — sans surprise, et le site vous appartient.",
    items: [
      {
        label: "Création du site",
        from: "2 499 €",
        note: "Payable en 3 ou 4 fois (env. 625 à 835 €/mois). La plupart des projets se situent entre 3 000 € et 4 500 € selon le périmètre.",
      },
      {
        label: "Suivi mensuel",
        from: "99 €/mois",
        note: "Hébergement, maintenance et référencement. L'abonnement de base, sans engagement de durée.",
      },
      {
        label: "Gestion Google Ads",
        from: "400 €/mois",
        badge: "Option",
        note: "En option, hors budget publicitaire (versé directement à Google). Pour ceux qui veulent lancer de la pub — jamais imposé.",
      },
    ],
  },

  // Avis clients. Section masquée automatiquement si le tableau est vide.
  reviews: [
    {
      quote:
        "Mon ancien site ne m'amenait rien. Trois mois après la refonte, je reçois des demandes de devis qualifiées chaque semaine — exactement le type de clients que je vise.",
      author: "Karim B.",
      role: "Atelier PPF & covering · Strasbourg",
    },
    {
      quote:
        "Enfin un site à la hauteur de nos prestations, et surtout il travaille pour nous : les réservations arrivent toutes seules. Un seul interlocuteur, zéro prise de tête.",
      author: "Thomas R.",
      role: "Detailing · Lyon",
    },
    {
      quote:
        "Naviel a tout géré, du design à la mise en ligne et au référencement. En quelques semaines on était en première page Google sur nos recherches locales.",
      author: "Julie M.",
      role: "Institut & esthétique · Paris",
    },
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
      name: "Artisanat & commerce",
      slug: "artisanat-premium",
      featured: false,
      desc: "",
    },
    {
      name: "Immobilier",
      slug: "immobilier-premium",
      featured: false,
      desc: "",
    },
  ],

  // Fondateur (section « Derrière Naviel » sur /agence).
  // Tout champ vide n'affiche RIEN (aucun placeholder visible).
  founder: {
    name: "Nathan",
    role: "Fondateur · Naviel",
    photo: "/founder.webp", // déposer une vraie photo dans /public (remplace le placeholder)
    bio: "J'ai lancé Naviel après des années à concevoir des sites et piloter des campagnes d'acquisition pour des artisans et des commerces de service. Le constat : trop d'agences livrent un beau site et disparaissent. Chez Naviel, vous parlez directement à l'expert qui conçoit votre site, le référence et amène les clients — du premier appel jusqu'aux résultats.",
  },

  // Mots-clés (secteurs) affichés dans le marquee
  keywords: [
    "Auto premium",
    "Habitat & rénovation",
    "Beauté & esthétique",
    "Santé",
    "Artisanat",
    "Commerce local",
  ],
};

export default site;
