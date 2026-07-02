import type { Metadata } from "next";
import { DestinationQuiz } from "@/components/quiz/destination-quiz";

export const metadata: Metadata = {
  title: "Quiz — Trouvez votre destination temporelle | TimeTravel Agency",
  description:
    "Répondez à 4 questions et laissez Chronos, notre agent IA, vous recommander la destination temporelle idéale.",
};

export default function QuizPage() {
  return (
    <section className="container-tt py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="eyebrow">Recommandation personnalisée</p>
        <h1 className="section-title mt-2">Quelle époque est faite pour vous ?</h1>
        <p className="mt-4 text-slate-400">
          Quatre questions suffisent. Notre agent Chronos analyse vos préférences
          et vous recommande la destination temporelle qui vous correspond, avec
          une explication personnalisée.
        </p>
      </div>

      <DestinationQuiz />
    </section>
  );
}
