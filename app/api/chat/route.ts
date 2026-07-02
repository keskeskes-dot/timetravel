import { NextResponse } from "next/server";
import { destinations, formatEuros } from "@/lib/destinations";
import { MAX_HISTORY_MESSAGES, MAX_MESSAGE_LENGTH } from "@/lib/chat";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const MODEL = process.env.MISTRAL_MODEL ?? "mistral-small-latest";
const MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions";

/** Débit autorisé : 20 requêtes par minute et par IP (usage gratuit maîtrisé). */
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function buildSystemPrompt(): string {
  const catalogue = destinations
    .map((d) => {
      const priceLine = `Tarifs : à partir de ${formatEuros(d.pricing.from)} par personne (formule Découverte), jusqu'à ${formatEuros(d.pricing.premium)} par personne en formule Prestige tout inclus.`;
      return [
        `### ${d.name} — ${d.era} (${d.year})`,
        `Accroche : ${d.tagline}`,
        `Description : ${d.description}`,
        `Points forts : ${d.highlights.join(" ; ")}`,
        `Climat : ${d.climate} · Durée : ${d.duration} · Niveau : ${d.difficulty}`,
        priceLine,
        `Page sur le site : /destinations/${d.slug}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    "Tu es l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe.",
    "Ton rôle : conseiller les clients sur les meilleures destinations temporelles.",
    "",
    "Ton ton :",
    "- Professionnel mais chaleureux",
    "- Passionné d'histoire",
    "- Toujours enthousiaste sans être trop familier",
    "- Expertise en voyage temporel (fictif mais crédible)",
    "",
    "Tu connais parfaitement :",
    "- Paris 1889 (Belle Époque, Tour Eiffel, Exposition Universelle)",
    "- Crétacé -100M (dinosaures, nature préhistorique)",
    "- Florence 1504 (Renaissance, art, Michel-Ange)",
    "",
    "Tu dois pouvoir répondre à :",
    "- Les questions sur les destinations",
    "- Les informations sur les prix (utilise les tarifs indiqués ci-dessous, reste cohérent d'un message à l'autre)",
    "- Les conseils pour choisir une époque selon les envies du client",
    "- La FAQ de l'agence de voyage",
    "",
    "Consignes :",
    "- Réponds toujours en français.",
    "- Reste concis (2 à 5 phrases en général) sauf si le client demande explicitement des détails.",
    "- Appuie-toi sur le catalogue ci-dessous ; n'invente pas de destination qui n'existe pas.",
    "- Quand tu cites ou recommandes une destination, insère un lien markdown vers sa page du site en utilisant l'URL fournie dans le catalogue, au format [Nom de la destination](/destinations/slug). N'invente jamais d'autre URL et n'affiche pas l'URL brute.",
    "- Les voyages sont 100 % sécurisés, encadrés par un guide temporel certifié ; rien ne peut altérer le cours de l'Histoire.",
    "- Si une question sort du cadre du voyage temporel, ramène poliment la conversation vers nos destinations.",
    "",
    "Catalogue des destinations :",
    "",
    catalogue,
    "",
    "FAQ agence :",
    "- Sécurité : chaque départ est encadré par un guide temporel certifié et une balise de rappel ; le voyageur ne peut pas altérer l'Histoire.",
    "- Réservation : choisir une destination, échanger avec l'assistant pour affiner l'itinéraire, puis valider les dates.",
    "- Souvenirs : seuls les souvenirs immatériels (photos holographiques) sont autorisés ; rien ne franchit la frontière temporelle.",
    "- Équipement : combinaison thermorégulée, implant de traduction et balise de rappel fournis à l'embarquement.",
  ].join("\n");
}

export async function POST(request: Request) {
  const limit = rateLimit(
    `chat:${getClientIp(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!limit.ok) {
    return NextResponse.json(
      {
        error:
          "Vous envoyez des messages trop rapidement. Patientez un instant avant de réessayer.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "La clé API Mistral n'est pas configurée." },
      { status: 500 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const cleaned = (Array.isArray(body.messages) ? body.messages : [])
    .filter(
      (m) => typeof m?.content === "string" && m.content.trim().length > 0,
    )
    .map((m) => ({
      role: (m.role === "assistant" ? "assistant" : "user") as ChatRole,
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (cleaned.length === 0) {
    return NextResponse.json(
      { error: "Aucun message à traiter." },
      { status: 400 },
    );
  }

  // On ne transmet au modèle que les messages les plus récents (tokens bornés).
  const history = cleaned.slice(-MAX_HISTORY_MESSAGES);

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
        max_tokens: 800,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...history,
        ],
      }),
    });

    if (!mistralResponse.ok) {
      const detail = await mistralResponse.text();
      console.error("Erreur Mistral:", mistralResponse.status, detail);
      return NextResponse.json(
        { error: "Le service de conversation est momentanément indisponible." },
        { status: 502 },
      );
    }

    const data = await mistralResponse.json();
    const reply: string =
      data?.choices?.[0]?.message?.content?.toString().trim() ?? "";

    if (!reply) {
      return NextResponse.json(
        {
          error:
            "Je n'ai pas pu formuler de réponse. Pouvez-vous reformuler votre demande ?",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Erreur lors de l'appel à Mistral:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la connexion à l'agent." },
      { status: 500 },
    );
  }
}
