"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Accueil", href: "/#top" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Quiz", href: "/quiz" },
  { label: "L'agence", href: "/#agence" },
  { label: "FAQ", href: "/#faq" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors ${
        scrolled
          ? "border-b border-white/10 bg-void-950/80 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <nav className="container-tt flex h-16 items-center justify-between">
        <Link href="/#top" className="flex items-center gap-2">
          <Image
            src="/images/logo-mark.png"
            alt="TimeTravel Agency"
            width={311}
            height={326}
            priority
            className="h-9 w-auto"
          />
          <span className="font-display text-lg font-bold text-white">
            TimeTravel<span className="text-chrono-gold"> Agency</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-chat"))
            }
          >
            💬 Parler à l&apos;agent
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white md:hidden"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-void-950/95 backdrop-blur md:hidden">
          <ul className="container-tt flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-3 text-base text-slate-200 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <button
                type="button"
                className="btn-primary w-full"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent("open-chat"));
                }}
              >
                💬 Parler à l&apos;agent
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
