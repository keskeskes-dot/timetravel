"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MAX_HISTORY_MESSAGES, MAX_MESSAGE_LENGTH } from "@/lib/chat";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const LINK_CLASS =
  "font-semibold text-chrono-gold underline underline-offset-2 hover:text-chrono-amber";

/**
 * Parse récursivement un texte markdown léger : **gras** et liens [texte](url),
 * y compris imbriqués (ex. **[texte](url)** ou [**texte**](url)).
 */
function parseInline(text: string, keyPrefix: string): React.ReactNode[] {
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const key = `${keyPrefix}-${i}`;
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-white">
          {parseInline(match[1], key)}
        </strong>,
      );
    } else {
      const label = match[2];
      const href = match[3];
      const children = parseInline(label, key);
      nodes.push(
        href.startsWith("/") ? (
          <Link key={key} href={href} className={LINK_CLASS}>
            {children}
          </Link>
        ) : (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            {children}
          </a>
        ),
      );
    }

    lastIndex = regex.lastIndex;
    i++;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

/**
 * Rend un texte léger en markdown (gras, liens) en préservant les sauts de ligne.
 */
function renderContent(text: string) {
  return text.split("\n").map((line, lineIndex, lines) => (
    <span key={lineIndex}>
      {parseInline(line, `l${lineIndex}`)}
      {lineIndex < lines.length - 1 && <br />}
    </span>
  ));
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Bonjour ! Je suis Chronos, votre conseiller TimeTravel. Dites-moi ce qui vous fait rêver : la Belle Époque, les dinosaures, ou la Renaissance ?",
  },
];

const STORAGE_KEY = "timetravel-chat";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restaure la conversation sauvegardée (persiste entre les pages et rechargements).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          messages?: Message[];
          open?: boolean;
        };
        if (Array.isArray(saved.messages) && saved.messages.length > 0) {
          setMessages(saved.messages);
        }
        if (typeof saved.open === "boolean") {
          setOpen(saved.open);
        }
      }
    } catch {
      // Stockage indisponible : on garde l'état par défaut.
    }
    setHydrated(true);
  }, []);

  // Sauvegarde la conversation à chaque changement (une fois hydraté).
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, open }));
    } catch {
      // Ignore les erreurs de quota / mode privé.
    }
  }, [messages, open, hydrated]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open, loading]);

  function resetConversation() {
    setMessages(initialMessages);
    setInput("");
    setLoading(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Stockage indisponible : rien à nettoyer.
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed.slice(0, MAX_MESSAGE_LENGTH) },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // On n'envoie que les messages récents pour borner les tokens.
        body: JSON.stringify({
          messages: nextMessages.slice(-MAX_HISTORY_MESSAGES),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Erreur inattendue.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply as string },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Désolé, une erreur est survenue. Réessayez dans un instant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Ouvrir le chat"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-chrono-gold text-2xl text-void-950 shadow-lg shadow-chrono-gold/30 transition hover:bg-chrono-amber"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[70vh] max-h-[520px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-900 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-white/10 bg-void-800 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-chrono-gold/20 text-lg">
              🧭
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Chronos</p>
              <p className="text-xs text-chrono-teal">
                Conseiller TimeTravel · en ligne
              </p>
            </div>
            <button
              type="button"
              onClick={resetConversation}
              disabled={loading || messages.length <= 1}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-chrono-gold/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              title="Réinitialiser la conversation"
            >
              Réinitialiser
            </button>
          </div>

          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-atomic="false"
            aria-label="Conversation avec Chronos"
            className="flex-1 space-y-3 overflow-y-auto p-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-chrono-gold text-void-950"
                      : "bg-void-800 text-slate-200"
                  }`}
                >
                  {m.role === "assistant" ? renderContent(m.content) : m.content}
                </p>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <p className="flex items-center gap-1 rounded-2xl bg-void-800 px-3 py-2 text-sm text-slate-200">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-chrono-teal [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-chrono-teal [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-chrono-teal" />
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-white/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre message..."
              disabled={loading}
              maxLength={MAX_MESSAGE_LENGTH}
              className="flex-1 rounded-full border border-white/10 bg-void-950 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-chrono-gold/50 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-chrono-gold text-void-950 transition hover:bg-chrono-amber disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Envoyer"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
