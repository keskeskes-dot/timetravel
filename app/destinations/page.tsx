import type { Metadata } from "next";
import { destinations } from "@/lib/destinations";
import { DestinationCard } from "@/components/destination-card";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Destinations — TimeTravel Agency",
  description: "Toutes nos destinations temporelles disponibles.",
};

export default function DestinationsPage() {
  return (
    <section className="container-tt py-16">
      <Reveal>
        <p className="eyebrow">Galerie</p>
        <h1 className="section-title mt-2">Toutes nos destinations</h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Trois époques, trois expériences hors du temps. Choisissez la vôtre et
          laissez-vous guider par Chronos pour la personnaliser.
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {destinations.map((d) => (
          <DestinationCard key={d.slug} destination={d} />
        ))}
      </Reveal>
    </section>
  );
}
