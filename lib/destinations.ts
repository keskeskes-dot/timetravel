export type Faq = {
  question: string;
  answer: string;
};

/** Tarifs indicatifs (fictifs mais cohérents) par personne, en euros. */
export type Pricing = {
  /** Prix d'entrée, formule Découverte. */
  from: number;
  /** Prix de la formule Prestige tout inclus. */
  premium: number;
};

export type Destination = {
  slug: string;
  name: string;
  era: string;
  year: string;
  tagline: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  climate: string;
  duration: string;
  difficulty: "Facile" | "Modéré" | "Aventure";
  /** Tarifs par personne (formules Découverte et Prestige). */
  pricing: Pricing;
  /** Tailwind gradient classes used as a fallback / overlay behind the image */
  gradient: string;
  /** Emoji used as a lightweight fallback icon */
  icon: string;
  /** Path to the destination visual served from /public */
  image: string;
  faq: Faq[];
};

export const destinations: Destination[] = [
  {
    slug: "paris-1889",
    name: "Paris 1889",
    era: "Belle Époque",
    year: "1889",
    tagline: "L'Exposition Universelle et l'inauguration de la Tour Eiffel",
    shortDescription:
      "Vivez l'effervescence de la Belle Époque au cœur de l'Exposition Universelle.",
    description:
      "Débarquez à Paris au printemps 1889, alors que la ville dévoile au monde la toute nouvelle Tour Eiffel. Flânez sur le Champ-de-Mars parmi les pavillons de l'Exposition Universelle, croisez ingénieurs, artistes et curieux venus du monde entier, et savourez l'optimisme d'une époque qui invente la modernité.",
    highlights: [
      "Montée exclusive au sommet de la Tour Eiffel le jour de son inauguration",
      "Déambulation dans les pavillons de l'Exposition Universelle",
      "Dîner dans un cabaret de Montmartre",
      "Rencontre avec Gustave Eiffel (option guidée)",
    ],
    climate: "Tempéré, printemps doux",
    duration: "3 jours",
    difficulty: "Facile",
    pricing: { from: 12900, premium: 18500 },
    gradient: "from-amber-500/30 via-void-800 to-void-950",
    icon: "🗼",
    image: "/images/paris.png",
    faq: [
      {
        question: "Faut-il parler français pour visiter Paris 1889 ?",
        answer:
          "Non, votre implant de traduction temporel gère le français d'époque. Quelques mots restent toutefois appréciés des locaux.",
      },
      {
        question: "Peut-on vraiment monter en haut de la Tour Eiffel ?",
        answer:
          "Oui, l'accès au sommet est inclus le jour de l'inauguration, avec un créneau réservé aux voyageurs TimeTravel.",
      },
    ],
  },
  {
    slug: "cretace",
    name: "Crétacé",
    era: "Ère des dinosaures",
    year: "-100 000 000",
    tagline: "Une expédition au temps des grands dinosaures",
    shortDescription:
      "Observez les géants du Crétacé et approchez les espèces les plus douces, bébés dinos compris.",
    description:
      "Remontez cent millions d'années en arrière, à l'apogée des dinosaures. Depuis une plateforme d'observation blindée, admirez troupeaux de tricératops, vols de ptérosaures et la silhouette impressionnante des grands prédateurs. Mais le Crétacé n'est pas que démesure : nos rangers temporels ont identifié plusieurs espèces herbivores parfaitement paisibles. Sous leur supervision, vous pourrez approcher et même caresser certains de ces dinosaures dociles, et faire la connaissance de bébés dinos en tout genre dans notre nurserie préhistorique. Une immersion à la fois brute et attendrissante, au cœur d'une nature démesurée.",
    highlights: [
      "Safari d'observation en véhicule chrono-blindé",
      "Rencontre encadrée avec les dinosaures dociles : caresses autorisées",
      "Visite de la nurserie et câlins aux bébés dinos en tout genre",
      "Survol de la canopée préhistorique",
      "Atelier paléo-botanique avec un guide scientifique",
      "Nuit sous dôme d'observation des étoiles du Crétacé",
    ],
    climate: "Chaud et humide, tropical",
    duration: "2 jours",
    difficulty: "Aventure",
    pricing: { from: 24500, premium: 32000 },
    gradient: "from-emerald-500/30 via-void-800 to-void-950",
    icon: "🦖",
    image: "/images/cretace.png",
    faq: [
      {
        question: "Est-ce dangereux d'approcher les dinosaures ?",
        answer:
          "L'observation des grands prédateurs se fait depuis des structures blindées ou des véhicules sécurisés. En revanche, certaines espèces herbivores sont réputées douces : nos rangers temporels vous autorisent à les approcher et à les caresser lors de rencontres encadrées, tout comme les bébés dinos de la nurserie.",
      },
      {
        question: "Quel équipement est fourni ?",
        answer:
          "Combinaison thermorégulée, masque filtrant l'air préhistorique et balise de rappel temporel sont fournis à l'embarquement.",
      },
    ],
  },
  {
    slug: "florence-1504",
    name: "Florence 1504",
    era: "Renaissance",
    year: "1504",
    tagline: "Au cœur de la Renaissance, entre Léonard et Michel-Ange",
    shortDescription:
      "Assistez au dévoilement du David et côtoyez les génies de la Renaissance.",
    description:
      "Plongez dans la Florence des Médicis en 1504, l'année où Michel-Ange dévoile son David. Arpentez les ateliers où travaillent les plus grands maîtres, observez Léonard de Vinci esquisser ses machines, et laissez-vous porter par le foisonnement artistique et intellectuel d'une cité au sommet de son art.",
    highlights: [
      "Assister au dévoilement public du David de Michel-Ange",
      "Visite privée d'un atelier de la Renaissance",
      "Rencontre avec Léonard de Vinci (option guidée)",
      "Banquet florentin dans un palais des Médicis",
    ],
    climate: "Méditerranéen, printemps ensoleillé",
    duration: "3 jours",
    difficulty: "Modéré",
    pricing: { from: 15800, premium: 21000 },
    gradient: "from-rose-500/30 via-void-800 to-void-950",
    icon: "🎨",
    image: "/images/florence.png",
    faq: [
      {
        question: "Peut-on rencontrer Léonard de Vinci ?",
        answer:
          "Une rencontre encadrée est proposée en option. Les interactions restent discrètes pour préserver le cours de l'Histoire.",
      },
      {
        question: "Le dévoilement du David est-il garanti ?",
        answer:
          "Oui, la date du 8 septembre 1504 est incluse dans l'itinéraire, avec un emplacement réservé sur la Piazza della Signoria.",
      },
    ],
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

/** Formate un montant en euros selon la locale française (ex. « 12 900 € »). */
export function formatEuros(value: number): string {
  return `${value.toLocaleString("fr-FR")} €`;
}
