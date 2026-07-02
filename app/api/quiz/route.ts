import { NextResponse } from "next/server";
import {
  isQuizComplete,
  recommendDestination,
  summarizeAnswers,
} from "@/lib/quiz";
import type { Destination } from "@/lib/destinations";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.MISTRAL_MODEL ?? "mistral-small-latest";
const MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions";

/** Débit autorisé : 15 requêtes par minute et par IP (usage gratuit maîtrisé). */
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;

function buildQuizPrompt(
  destination: Destination,
  answersSummary: string[],
): string {
  return [
    "Tu es Chronos, le conseiller de TimeTravel Agency, une agence de voyage temporel de luxe.",
    "Un client vient de terminer un quiz de préférences. En te basant sur ses réponses,",
    `notre algorithme recommande la destination : ${destination.name} (${destination.era}, ${destination.year}).`,
    "",
    "Réponses du client :",
    ...answersSummary.map((line) => `- ${line}`),
    "",
    "Informations sur la destination recommandée :",
    `- Accroche : ${destination.tagline}`,
    `- Description : ${destination.description}`,
    `- Points forts : ${destination.highlights.join(" ; ")}`,
    `- Climat : ${destination.climate} · Durée : ${destination.duration} · Niveau : ${destination.difficulty}`,
    "",
    "Ta mission : rédige une explication personnalisée et chaleureuse (3 à 4 phrases)",
    "qui montre au client POURQUOI cette destination lui correspond, en faisant explicitement",
    "le lien avec ses réponses au quiz. Reste en français, enthousiaste mais élégant.",
    "N'invente aucune autre destination. Ne mets pas de titre, réponds directement par le texte.",
  ].join("\n");
}

/** Explication de repli, cohérente et sans IA, si l'API est indisponible. */
function fallbackExplanation(
  destination: Destination,
  answersSummary: string[],
): string {
  const envies = answersSummary
    .map((line) => line.split("→")[1]?.trim())
    .filter(Boolean)
    .join(", ");
  return [
    `D'après vos réponses (${envies}), ${destination.name} est la destination faite pour vous.`,
    `${destination.tagline} : ${destination.shortDescription}`,
    `Au programme notamment : ${destination.highlights[0]}. Durée ${destination.duration}, niveau ${destination.difficulty}.`,
  ].join(" ");
}

export async function POST(request: Request) {
  const limit = rateLimit(
    `quiz:${getClientIp(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!limit.ok) {
    return NextResponse.json(
      {
        error:
          "Trop de tentatives en peu de temps. Patientez un instant avant de relancer le quiz.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: { answers?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const answers = body.answers ?? {};
  if (!isQuizComplete(answers)) {
    return NextResponse.json(
      { error: "Merci de répondre à toutes les questions." },
      { status: 400 },
    );
  }

  const result = recommendDestination(answers);
  const answersSummary = summarizeAnswers(answers);
  const apiKey = process.env.MISTRAL_API_KEY;

  // Sans clé API : on renvoie une recommandation déterministe cohérente.
  if (!apiKey) {
    return NextResponse.json({
      slug: result.destination.slug,
      name: result.destination.name,
      era: result.destination.era,
      year: result.destination.year,
      image: result.destination.image,
      href: `/destinations/${result.destination.slug}`,
      scores: result.scores,
      explanation: fallbackExplanation(result.destination, answersSummary),
      source: "fallback",
    });
  }

  try {
    const mistralResponse = await fetch(MISTRAL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content: buildQuizPrompt(result.destination, answersSummary),
          },
          {
            role: "user",
            content:
              "Explique-moi pourquoi cette destination me correspond, d'après mes réponses.",
          },
        ],
      }),
    });

    if (!mistralResponse.ok) {
      const detail = await mistralResponse.text();
      console.error("Erreur Mistral (quiz):", mistralResponse.status, detail);
      return NextResponse.json({
        slug: result.destination.slug,
        name: result.destination.name,
        era: result.destination.era,
        year: result.destination.year,
        image: result.destination.image,
        href: `/destinations/${result.destination.slug}`,
        scores: result.scores,
        explanation: fallbackExplanation(result.destination, answersSummary),
        source: "fallback",
      });
    }

    const data = await mistralResponse.json();
    const explanation: string =
      data?.choices?.[0]?.message?.content?.toString().trim() ??
      fallbackExplanation(result.destination, answersSummary);

    return NextResponse.json({
      slug: result.destination.slug,
      name: result.destination.name,
      era: result.destination.era,
      year: result.destination.year,
      image: result.destination.image,
      href: `/destinations/${result.destination.slug}`,
      scores: result.scores,
      explanation,
      source: "ai",
    });
  } catch (error) {
    console.error("Erreur lors de l'appel à Mistral (quiz):", error);
    return NextResponse.json({
      slug: result.destination.slug,
      name: result.destination.name,
      era: result.destination.era,
      year: result.destination.year,
      image: result.destination.image,
      href: `/destinations/${result.destination.slug}`,
      scores: result.scores,
      explanation: fallbackExplanation(result.destination, answersSummary),
      source: "fallback",
    });
  }
}
