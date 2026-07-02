"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-tt flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl font-bold text-chrono-gold">⚠</p>
      <h1 className="section-title mt-4">Turbulence temporelle</h1>
      <p className="mt-4 max-w-md text-slate-400">
        Une anomalie est survenue pendant le voyage. Nos ingénieurs recalibrent
        le flux temporel : réessayez dans un instant.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn-primary">
          Réessayer
        </button>
        <Link href="/" className="btn-ghost">
          Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}
