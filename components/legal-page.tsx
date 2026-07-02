import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <article className="container-tt py-16">
      <Link
        href="/"
        className="text-sm text-slate-400 transition hover:text-white"
      >
        ← Retour à l&apos;accueil
      </Link>

      <h1 className="mt-4 font-display text-4xl font-bold text-white">
        {title}
      </h1>
      {intro ? (
        <p className="mt-4 max-w-3xl text-slate-400">{intro}</p>
      ) : null}

      <div className="legal-content mt-10 max-w-3xl space-y-8 text-slate-300">
        {children}
      </div>

      <p className="mt-12 max-w-3xl rounded-2xl border border-chrono-gold/20 bg-void-900 p-4 text-sm text-slate-400">
        TimeTravel Agency est une agence de voyage temporel <strong>fictive</strong>,
        réalisée dans le cadre d&apos;un projet étudiant. Les destinations, tarifs
        et services décrits sont imaginaires et sans valeur contractuelle.
      </p>
    </article>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold text-white">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-300">
        {children}
      </div>
    </section>
  );
}
