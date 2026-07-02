"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  /** Léger décalage pour enchaîner deux blocs voisins. */
  delay?: number;
};

/**
 * Fait apparaître son contenu en fondu ascendant quand il entre dans le viewport.
 * Respecte la préférence "réduire les animations".
 */
export function Reveal({ children, delay = 0, ...props }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: DURATION, ease: EASE, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
