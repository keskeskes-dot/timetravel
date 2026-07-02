"use client";

import { useState } from "react";
import type { Faq } from "@/lib/destinations";

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-void-900">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-white">
                {item.question}
              </span>
              <span
                className={`text-chrono-gold transition-transform ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-sm text-slate-400">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
