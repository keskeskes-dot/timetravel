import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  destinations,
  formatEuros,
  type Destination,
} from "@/lib/destinations";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Comparateur de destinations — TimeTravel Agency",
  description:
    "Comparez d'un coup d'œil nos époques : durée, climat, niveau, tarifs et temps forts, pour choisir le voyage temporel fait pour vous.",
};

type Row = {
  label: string;
  render: (d: Destination) => ReactNode;
};

const rows: Row[] = [
  { label: "Époque", render: (d) => d.era },
  { label: "Année", render: (d) => d.year },
  { label: "Durée", render: (d) => d.duration },
  { label: "Climat", render: (d) => d.climate },
  { label: "Niveau", render: (d) => d.difficulty },
  {
    label: "Dès (Découverte)",
    render: (d) => (
      <span className="font-semibold text-chrono-gold">
        {formatEuros(d.pricing.from)}
      </span>
    ),
  },
  {
    label: "Prestige",
    render: (d) => (
      <span className="font-semibold text-chrono-gold">
        {formatEuros(d.pricing.premium)}
      </span>
    ),
  },
  {
    label: "Temps forts",
    render: (d) => (
      <ul className="space-y-1 text-left">
        {d.highlights.slice(0, 3).map((h) => (
          <li key={h} className="flex gap-2 text-slate-300">
            <span className="text-chrono-gold">✦</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
    ),
  },
];

export default function ComparateurPage() {
  return (
    <section className="container-tt py-16">
      <Reveal>
        <p className="eyebrow">Comparateur</p>
        <h1 className="section-title mt-2">Comparez nos époques</h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Durée, climat, niveau, tarifs et temps forts : mettez nos destinations
          côte à côte pour trouver le voyage temporel qui vous ressemble.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-40 p-3 text-left align-bottom text-sm font-semibold text-slate-400">
                Critère
              </th>
              {destinations.map((d) => (
                <th key={d.slug} className="p-3 align-bottom">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-void-900">
                    <div className="relative h-28">
                      <Image
                        src={d.image}
                        alt={`${d.name} — ${d.era}`}
                        fill
                        sizes="(max-width: 1024px) 33vw, 300px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-void-950/80 to-transparent" />
                    </div>
                    <div className="p-3 text-center">
                      <p className="font-display text-lg font-bold text-white">
                        {d.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{d.tagline}</p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                <th className="p-3 text-left text-sm font-semibold text-slate-400">
                  {row.label}
                </th>
                {destinations.map((d) => (
                  <td
                    key={d.slug}
                    className="p-3 text-center align-top text-sm text-slate-200"
                  >
                    {row.render(d)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th className="p-3" />
              {destinations.map((d) => (
                <td key={d.slug} className="p-3 text-center align-top">
                  <Link
                    href={`/destinations/${d.slug}`}
                    className="btn-primary inline-flex"
                  >
                    Découvrir →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Reveal>

      <Reveal delay={0.15} className="mt-12 text-center">
        <p className="text-slate-400">
          Vous hésitez encore ? Laissez notre quiz décider pour vous.
        </p>
        <Link href="/quiz" className="btn-ghost mt-4 inline-flex">
          Lancer le quiz →
        </Link>
      </Reveal>
    </section>
  );
}
