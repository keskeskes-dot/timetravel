import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/lib/destinations";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-void-950">
      <div className="container-tt grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo-mark.png"
              alt="TimeTravel Agency"
              width={311}
              height={326}
              className="h-8 w-auto"
            />
            <span className="font-display text-lg font-bold text-white">
              TimeTravel Agency
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-400">
            L&apos;agence qui vous emmène là où le temps n&apos;est plus une
            limite.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Destinations</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            {destinations.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/destinations/${d.slug}`}
                  className="transition hover:text-white"
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Navigation</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <Link href="/#agence" className="transition hover:text-white">
                L&apos;agence
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="transition hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/destinations"
                className="transition hover:text-white"
              >
                Toutes les destinations
              </Link>
            </li>
            <li>
              <Link
                href="/comparateur"
                className="transition hover:text-white"
              >
                Comparateur
              </Link>
            </li>
            <li>
              <Link href="/quiz" className="transition hover:text-white">
                Quiz
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Légal</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <Link
                href="/mentions-legales"
                className="transition hover:text-white"
              >
                Mentions légales
              </Link>
            </li>
            <li>
              <Link
                href="/politique-temporelle"
                className="transition hover:text-white"
              >
                Politique temporelle
              </Link>
            </li>
            <li>
              <Link href="/cgv" className="transition hover:text-white">
                CGV du voyage
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="container-tt text-center text-xs text-slate-500">
          © {new Date().getFullYear()} TimeTravel Agency — Projet étudiant.
          Destinations fictives, visuels générés par IA.
        </p>
      </div>
    </footer>
  );
}
