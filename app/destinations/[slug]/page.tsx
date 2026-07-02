import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { destinations, getDestination } from "@/lib/destinations";
import { FaqAccordion } from "@/components/faq-accordion";
import { OpenChatButton } from "@/components/open-chat-button";
import { Reveal } from "@/components/motion/reveal";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const destination = getDestination(params.slug);
  if (!destination) return { title: "Destination introuvable" };
  return {
    title: `${destination.name} — TimeTravel Agency`,
    description: destination.shortDescription,
  };
}

export default function DestinationDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const destination = getDestination(params.slug);
  if (!destination) notFound();

  return (
    <article className="pb-8">
      {/* Hero visual */}
      <div className="relative h-72 overflow-hidden sm:h-96">
        <Image
          src={destination.image}
          alt={`${destination.name} — ${destination.era}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/40 to-void-950/20" />
      </div>

      <div className="container-tt -mt-16 relative">
        <div className="rounded-3xl border border-white/10 bg-void-900 p-8 sm:p-10">
          <Link
            href="/destinations"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Toutes les destinations
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-chrono-gold/15 px-3 py-1 text-xs font-semibold text-chrono-gold">
              {destination.era}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {destination.year}
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold text-white">
            {destination.name}
          </h1>
          <p className="mt-2 text-lg text-chrono-teal">{destination.tagline}</p>
          <p className="mt-6 max-w-3xl text-slate-300">
            {destination.description}
          </p>

          {/* Infos clés */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <InfoBox label="Durée" value={destination.duration} icon="⏱" />
            <InfoBox label="Climat" value={destination.climate} icon="🌡" />
            <InfoBox
              label="Niveau"
              value={destination.difficulty}
              icon="🎚"
            />
          </div>

          {/* Highlights */}
          <Reveal>
            <h2 className="mt-10 font-display text-2xl font-bold text-white">
              Temps forts du séjour
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {destination.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-void-950 p-4 text-sm text-slate-300"
                >
                  <span className="text-chrono-gold">✦</span>
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* FAQ */}
          <Reveal>
            <h2 className="mt-10 font-display text-2xl font-bold text-white">
              Questions fréquentes
            </h2>
            <div className="mt-4">
              <FaqAccordion items={destination.faq} />
            </div>
          </Reveal>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <OpenChatButton className="btn-primary">
              💬 Personnaliser avec l&apos;agent
            </OpenChatButton>
            <Link href="/#destinations" className="btn-ghost">
              Voir les autres époques
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-void-950 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {icon} {label}
      </p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}
