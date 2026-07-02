import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-tt flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-bold text-chrono-gold sm:text-8xl">
        404
      </p>
      <h1 className="section-title mt-4">Époque introuvable</h1>
      <p className="mt-4 max-w-md text-slate-400">
        Nos coordonnées temporelles ne mènent nulle part : la page que vous
        cherchez a peut-être été effacée de la ligne du temps.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
        <Link href="/destinations" className="btn-ghost">
          Voir les destinations
        </Link>
      </div>
    </section>
  );
}
