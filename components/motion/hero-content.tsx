"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { OpenChatButton } from "@/components/open-chat-button";
import { DURATION, EASE } from "@/lib/motion";

export function HeroContent() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.12,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  };

  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
      };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container-tt relative flex min-h-[88vh] flex-col items-center justify-center py-24 text-center"
    >
      <motion.div variants={item}>
        <Image
          src="/images/logo-dore-transparent.png"
          alt="TimeTravel Agency"
          width={693}
          height={612}
          priority
          className="mb-6 h-auto w-40 drop-shadow-[0_0_35px_rgba(232,176,75,0.25)] sm:w-52"
        />
      </motion.div>

      <motion.span variants={item} className="eyebrow">
        Agence de voyages temporels
      </motion.span>

      <motion.h1
        variants={item}
        className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight text-white sm:text-6xl"
      >
        Voyagez à travers <span className="text-chrono-gold">le temps</span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg"
      >
        De la Belle Époque au règne des dinosaures, TimeTravel Agency vous ouvre
        les portes des plus grands moments de l&apos;Histoire. Une expérience
        immersive, guidée et 100&nbsp;% sécurisée.
      </motion.p>

      <motion.div
        variants={item}
        className="mt-10 flex flex-col gap-3 sm:flex-row"
      >
        <Link href="#destinations" className="btn-primary">
          Découvrir les destinations →
        </Link>
        <OpenChatButton className="btn-ghost">
          💬 Parler à l&apos;agent
        </OpenChatButton>
      </motion.div>
    </motion.div>
  );
}
