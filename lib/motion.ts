import type { Variants } from "framer-motion";

/** Easing "naturel" (ease-out doux) partagé par toutes les animations. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Durée standard des animations d'entrée. */
export const DURATION = 0.7;

/** Fondu ascendant discret, réutilisé pour les sections et le hero. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE },
  },
};

/** Conteneur qui fait apparaître ses enfants les uns après les autres. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

/** Réglages de déclenchement au scroll (une seule fois, légèrement anticipé). */
export const viewportOnce = { once: true, margin: "-80px" } as const;
