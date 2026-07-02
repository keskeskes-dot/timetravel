import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/lib/destinations";
import { DestinationCard } from "@/components/destination-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { OpenChatButton } from "@/components/open-chat-button";
import { Reveal } from "@/components/motion/reveal";
import { HeroContent } from "@/components/motion/hero-content";

const generalFaq = [
  {
    question: "Le voyage temporel est-il sans danger ?",
    answer:
      "Oui. Chaque départ est encadré par un guide temporel certifié et une balise de rappel. Vous ne pouvez pas altérer le cours de l'Histoire.",
  },
  {
    question: "Comment se déroule une réservation ?",
    answer:
      "Choisissez une destination, échangez avec notre agent Chronos pour affiner votre itinéraire, puis validez vos dates. La réservation en ligne arrive bientôt.",
  },
  {
    question: "Puis-je ramener des souvenirs d'une autre époque ?",
    answer:
      "Seuls les souvenirs immatériels (photos holographiques) sont autorisés. Rien ne doit franchir la frontière temporelle.",
  },
];

const steps = [
  {
    n: "01",
    title: "Choisissez votre époque",
    text: "Parcourez nos destinations et trouvez le moment de l'Histoire qui vous appelle.",
  },
  {
    n: "02",
    title: "Discutez avec l'agent",
    text: "Chronos, notre agent IA, vous conseille et personnalise votre itinéraire.",
  },
  {
    n: "03",
    title: "Réservez et partez",
    text: "Validez vos dates et laissez-nous synchroniser votre départ temporel.",
  },
];

const stats = [
  { value: "3", label: "époques accessibles" },
  { value: "12k+", label: "voyageurs synchronisés" },
  { value: "100%", label: "retours garantis" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <Image
          src="/images/paris.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="starfield animate-drift absolute inset-0 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-void-950/70 via-void-950/60 to-void-950" />
        <HeroContent />
      </section>

      {/* AGENCE */}
      <section id="agence" className="container-tt py-20">
        <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">L&apos;agence</p>
            <h2 className="section-title mt-2">
              Pionniers du tourisme temporel
            </h2>
            <p className="mt-4 text-slate-400">
              Depuis notre première expédition, nous rendons l&apos;Histoire
              vivante. Nos ingénieurs temporels et nos guides experts conçoivent
              des séjours immersifs, respectueux du passé et taillés pour
              l&apos;émerveillement. Chaque voyage est unique, chaque instant
              est réel.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-void-900 p-5 text-center"
              >
                <p className="font-display text-3xl font-bold text-chrono-gold">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="container-tt py-20">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Galerie</p>
            <h2 className="section-title mt-2">Nos destinations temporelles</h2>
          </div>
          <Link
            href="/destinations"
            className="text-sm font-semibold text-chrono-gold hover:text-chrono-amber"
          >
            Tout voir →
          </Link>
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

      {/* QUIZ */}
      <section className="container-tt py-8">
        <div className="relative overflow-hidden rounded-3xl border border-chrono-gold/20 bg-gradient-to-br from-void-800 to-void-950 p-8 sm:p-12">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow">Recommandation personnalisée</p>
              <h2 className="section-title mt-2">
                Trouvez votre époque en 4 questions
              </h2>
              <p className="mt-4 text-slate-400">
                Pas sûr de votre destination ? Répondez à notre quiz : Chronos
                analyse vos préférences et vous recommande le voyage temporel
                fait pour vous, avec une explication personnalisée.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Link href="/quiz" className="btn-primary">
                Lancer le quiz →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="container-tt py-20">
        <Reveal className="text-center">
          <p className="eyebrow">Comment ça marche</p>
          <h2 className="section-title mt-2">Votre voyage en 3 étapes</h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-white/10 bg-void-900 p-6"
            >
              <span className="font-display text-4xl font-bold text-white/10">
                {step.n}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{step.text}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* AGENT + FAQ */}
      <section id="faq" className="container-tt py-20">
        <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-chrono-gold/20 bg-gradient-to-br from-void-800 to-void-950 p-8">
            <p className="eyebrow">Besoin de conseils ?</p>
            <h2 className="section-title mt-2">Discutez avec Chronos</h2>
            <p className="mt-4 text-slate-400">
              Notre agent conversationnel vous aide à choisir votre destination,
              répond à vos questions et personnalise votre séjour selon vos
              envies.
            </p>
            <OpenChatButton className="btn-primary mt-6">
              💬 Parler à l&apos;agent
            </OpenChatButton>
          </div>
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="section-title mb-6 mt-2">Questions fréquentes</h2>
            <FaqAccordion items={generalFaq} />
          </div>
        </Reveal>
      </section>

      {/* CTA FINAL */}
      <section className="container-tt pb-8">
        <Reveal className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-chrono-gold/20 via-void-800 to-void-900 p-10 text-center sm:p-16">
          <h2 className="section-title">Prêt à voyager dans le temps ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Choisissez votre époque et laissez Chronos préparer votre départ. La
            réservation en ligne arrive très bientôt.
          </p>
          <div className="mt-8">
            <Link href="#destinations" className="btn-primary">
              Choisir ma destination →
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
