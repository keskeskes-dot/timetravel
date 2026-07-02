import { destinations, type Destination } from "@/lib/destinations";

export type QuizOption = {
  /** Identifiant stable de l'option (utilisé pour le scoring). */
  id: string;
  label: string;
  /** Slug de la destination vers laquelle penche cette réponse. */
  destination: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

/**
 * Les 4 questions du quiz. Chaque option pointe vers l'une des 3 destinations
 * du catalogue (paris-1889, cretace, florence-1504). L'ordre des options est
 * toujours le même (Florence/culture, Crétacé/nature, Paris/raffinement) afin
 * que le scoring reste lisible et prévisible.
 */
export const quizQuestions: QuizQuestion[] = [
  {
    id: "experience",
    question: "Quel type d'expérience recherchez-vous ?",
    options: [
      { id: "exp-culture", label: "Culturelle et artistique", destination: "florence-1504" },
      { id: "exp-aventure", label: "Aventure et nature", destination: "cretace" },
      { id: "exp-elegance", label: "Élégance et raffinement", destination: "paris-1889" },
    ],
  },
  {
    id: "periode",
    question: "Votre période préférée ?",
    options: [
      { id: "per-moderne", label: "Histoire moderne (XIXe-XXe siècle)", destination: "paris-1889" },
      { id: "per-anciens", label: "Temps anciens et origines", destination: "cretace" },
      { id: "per-renaissance", label: "Renaissance et classicisme", destination: "florence-1504" },
    ],
  },
  {
    id: "ambiance",
    question: "Vous préférez :",
    options: [
      { id: "amb-urbaine", label: "L'effervescence urbaine", destination: "paris-1889" },
      { id: "amb-nature", label: "La nature sauvage", destination: "cretace" },
      { id: "amb-art", label: "L'art et l'architecture", destination: "florence-1504" },
    ],
  },
  {
    id: "activite",
    question: "Votre activité idéale :",
    options: [
      { id: "act-monuments", label: "Visiter des monuments", destination: "paris-1889" },
      { id: "act-faune", label: "Observer la faune", destination: "cretace" },
      { id: "act-musees", label: "Explorer des musées", destination: "florence-1504" },
    ],
  },
];

export type QuizResult = {
  destination: Destination;
  /** Score de la destination gagnante (nombre de réponses en sa faveur). */
  score: number;
  /** Détail des scores par slug, pour le débogage / la transparence. */
  scores: Record<string, number>;
};

/**
 * Algorithme de recommandation : chaque réponse ajoute un point à la
 * destination associée. La destination avec le plus de points l'emporte.
 *
 * `answers` associe l'id de chaque question à l'id de l'option choisie.
 * En cas d'égalité, on départage par l'ordre du catalogue (déterministe).
 */
export function recommendDestination(
  answers: Record<string, string>,
): QuizResult {
  const scores: Record<string, number> = {};
  for (const d of destinations) scores[d.slug] = 0;

  for (const question of quizQuestions) {
    const chosenId = answers[question.id];
    if (!chosenId) continue;
    const option = question.options.find((o) => o.id === chosenId);
    if (option && option.destination in scores) {
      scores[option.destination] += 1;
    }
  }

  let winner = destinations[0].slug;
  let best = -1;
  for (const d of destinations) {
    if (scores[d.slug] > best) {
      best = scores[d.slug];
      winner = d.slug;
    }
  }

  const destination = destinations.find((d) => d.slug === winner)!;
  return { destination, score: scores[winner], scores };
}

/** Vrai si toutes les questions ont reçu une réponse valide. */
export function isQuizComplete(answers: Record<string, string>): boolean {
  return quizQuestions.every((q) => {
    const chosen = answers[q.id];
    return q.options.some((o) => o.id === chosen);
  });
}

/**
 * Construit un résumé lisible des choix de l'utilisateur, utilisé pour
 * personnaliser la recommandation générée par l'IA.
 */
export function summarizeAnswers(answers: Record<string, string>): string[] {
  const summary: string[] = [];
  for (const question of quizQuestions) {
    const option = question.options.find((o) => o.id === answers[question.id]);
    if (option) {
      summary.push(`${question.question} → ${option.label}`);
    }
  }
  return summary;
}
