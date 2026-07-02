"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { quizQuestions } from "@/lib/quiz";
import { formatEuros, getDestination } from "@/lib/destinations";
import { EASE } from "@/lib/motion";

type QuizAnswer = {
  slug: string;
  name: string;
  era: string;
  year: string;
  image: string;
  href: string;
  explanation: string;
  scores: Record<string, number>;
  source: "ai" | "fallback";
};

type Status = "idle" | "loading" | "done" | "error";

export function DestinationQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<QuizAnswer | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [shared, setShared] = useState(false);

  const total = quizQuestions.length;
  const current = quizQuestions[step];
  const progress = status === "done" ? 100 : (step / total) * 100;

  async function submit(finalAnswers: Record<string, string>) {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Erreur inattendue.");
      }
      setResult(data as QuizAnswer);
      setStatus("done");
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Réessayez.",
      );
      setStatus("error");
    }
  }

  function choose(optionId: string) {
    const next = { ...answers, [current.id]: optionId };
    setAnswers(next);
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      void submit(next);
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
    setShared(false);
  }

  async function share(current: QuizAnswer) {
    const url =
      typeof window !== "undefined"
        ? new URL(current.href, window.location.origin).toString()
        : current.href;
    const shareData = {
      title: "TimeTravel Agency",
      text: `Chronos m'a recommandé ${current.name} (${current.era}) comme voyage temporel. Et vous, quelle époque ?`,
      url,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text} ${url}`);
        setShared(true);
        window.setTimeout(() => setShared(false), 2500);
      }
    } catch {
      /* partage annulé par l'utilisateur : rien à signaler */
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-void-900 p-6 sm:p-10">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>
            {status === "done"
              ? "Résultat"
              : `Question ${Math.min(step + 1, total)} / ${total}`}
          </span>
          <span>{Math.round(progress)} %</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-chrono-gold"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ÉTAT : questions */}
        {(status === "idle" || status === "error") && (
          <motion.div
            key={`q-${step}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <h3 className="font-display text-2xl font-bold text-white">
              {current.question}
            </h3>
            <div className="mt-6 space-y-3">
              {current.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => choose(option.id)}
                  className={`block w-full rounded-2xl border px-5 py-4 text-left text-sm transition ${
                    answers[current.id] === option.id
                      ? "border-chrono-gold bg-chrono-gold/10 text-white"
                      : "border-white/10 bg-void-950 text-slate-200 hover:border-chrono-gold/40 hover:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="mt-6 text-sm text-slate-400 transition hover:text-white"
              >
                ← Précédent
              </button>
            )}
            {status === "error" && (
              <p className="mt-4 text-sm text-rose-400">{errorMsg}</p>
            )}
          </motion.div>
        )}

        {/* ÉTAT : chargement */}
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-12 text-center"
          >
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-chrono-teal [animation-delay:-0.3s]" />
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-chrono-teal [animation-delay:-0.15s]" />
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-chrono-teal" />
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Chronos analyse vos réponses…
            </p>
          </motion.div>
        )}

        {/* ÉTAT : résultat */}
        {status === "done" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <p className="eyebrow">Votre destination idéale</p>
            <div className="relative mt-3 h-48 overflow-hidden rounded-2xl">
              <Image
                src={result.image}
                alt={`${result.name} — ${result.era}`}
                fill
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="font-display text-2xl font-bold text-white">
                  {result.name}
                </h3>
                <p className="text-sm text-chrono-gold">
                  {result.era} · {result.year}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-300">
              {result.explanation}
            </p>

            {(() => {
              const dest = getDestination(result.slug);
              return dest ? (
                <p className="mt-4 text-sm text-slate-400">
                  À partir de{" "}
                  <span className="font-semibold text-chrono-gold">
                    {formatEuros(dest.pricing.from)}
                  </span>{" "}
                  par personne.
                </p>
              ) : null;
            })()}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={result.href} className="btn-primary">
                Découvrir {result.name} →
              </Link>
              <button
                type="button"
                onClick={() => void share(result)}
                className="btn-ghost"
              >
                {shared ? "Lien copié ✓" : "Partager mon résultat"}
              </button>
              <button
                type="button"
                onClick={restart}
                className="btn-ghost"
              >
                Refaire le quiz
              </button>
            </div>

            {result.source === "fallback" && (
              <p className="mt-4 text-xs text-slate-500">
                Recommandation générée hors ligne (assistant IA momentanément
                indisponible).
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
