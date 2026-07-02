"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Destination } from "@/lib/destinations";
import { EASE } from "@/lib/motion";

const MotionLink = motion.create(Link);

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <MotionLink
      href={`/destinations/${destination.slug}`}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-900 transition-[border-color,box-shadow] duration-300 hover:border-chrono-gold/40 hover:shadow-xl hover:shadow-chrono-gold/10"
    >
      <div
        className={`relative h-44 overflow-hidden bg-gradient-to-br ${destination.gradient}`}
      >
        <Image
          src={destination.image}
          alt={`${destination.name} — ${destination.era}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-950/70 via-transparent to-transparent" />
        <span className="absolute right-3 top-3 rounded-full bg-void-950/60 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
          {destination.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{destination.era}</p>
        <h3 className="mt-1 font-display text-xl font-bold text-white">
          {destination.name}
        </h3>
        <p className="mt-2 flex-1 text-sm text-slate-400">
          {destination.shortDescription}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>⏱ {destination.duration}</span>
          <span>🌡 {destination.climate}</span>
        </div>

        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-chrono-gold">
          Explorer
          <span className="transition group-hover:translate-x-1">→</span>
        </span>
      </div>
    </MotionLink>
  );
}
