"use client";

/**
 * FrontHero — the agent-first primary surface for Casal Olives.
 * Per skill v1.18 ref 37: home `/` first viewport IS the concierge.
 */

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/components/analytics/TrackingPixel";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "I'm Olive — pull up a chair. Ask me which oil for your salad, the next Saturday tasting, what 'polyphenols 412' means, anything. I'll tell you straight.",
};

const PROMPTS = [
  "Which oil for a salad?",
  "What's the next Saturday tasting?",
  "What's the difference between Verde and Riserva?",
  "Do you have a gift for under €40?",
];

export function FrontHero() {
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [opened, setOpened] = useState(false);
  const transcriptIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (opened) messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, opened]);

  function pick(text: string) {
    trackEvent("prompt_click", { label: text, source: "hero" });
    void send(text);
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    if (!opened) {
      setOpened(true);
      trackEvent("front_open", { source: "hero" });
    }
    if (!transcriptIdRef.current) transcriptIdRef.current = crypto.randomUUID();
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m !== WELCOME),
          transcript_id: transcriptIdRef.current,
        }),
      });
      const j = (await res.json()) as { ok?: boolean; content?: string };
      const reply = j.content || "I'm slower than usual — give me a moment, or send your details to portfolio@concierge.studio.";
      setMessages((p) => [...p, { role: "assistant", content: reply }]);
      const lo = reply.toLowerCase();
      const escalated = /(i don't know|i'm not sure|i can't answer|reach out|portfolio@concierge|hand off|quote will follow)/.test(lo);
      const hadAnswer = j.ok !== false && reply.length > 0 && !escalated;
      trackEvent("front_question", {
        text: trimmed.slice(0, 200),
        had_answer: hadAnswer ? 1 : 0,
        source: "hero",
      });
      if (!hadAnswer)
        trackEvent("front_no_answer", { text: trimmed.slice(0, 200), source: "hero", fallback_kind: escalated ? "escalation" : "empty" });
    } catch (e) {
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "I couldn't reach the model. Send your details to portfolio@concierge.studio and I'll come back to you." },
      ]);
      trackEvent("front_question", { text: trimmed.slice(0, 200), had_answer: 0, source: "hero" });
      trackEvent("front_no_answer", { text: trimmed.slice(0, 200), source: "hero", fallback_kind: "fetch_error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="concierge" aria-label="Talk to Olive, the Casal Olives concierge" className="front-hero">
      <div className="front-hero-inner">
        <p className="eyebrow">Casal Olives · Mġarr</p>
        <h1 className="front-hero-headline">
          Ask Olive anything.
          <span className="front-hero-sub">
            Single-estate Mġarr olive oil. Three oils, one Saturday tasting.
            The grove our grandfather planted in 1962, bottled for the first
            time in 2024. Olive is the studio concierge — ask her about
            pairing, shipping, tastings, or the harvest. Scroll if you'd
            rather browse.
          </span>
        </h1>

        <div className="front-hero-thread" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`front-hero-msg ${m.role === "user" ? "is-user" : "is-asst"}`}>
              {m.content}
            </div>
          ))}
          {busy && <div className="front-hero-msg is-asst is-busy">…</div>}
          <div ref={messagesEndRef} />
        </div>

        {!opened && (
          <div className="front-hero-prompts" role="list">
            {PROMPTS.map((p) => (
              <button key={p} type="button" className="front-hero-chip" onClick={() => pick(p)}>{p}</button>
            ))}
          </div>
        )}

        <form className="front-hero-form" onSubmit={(e) => { e.preventDefault(); void send(input); }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Olive about oils, dates, pairing…"
            disabled={busy}
            aria-label="Message Olive"
            className="front-hero-input"
            autoComplete="off"
          />
          <button type="submit" disabled={busy || !input.trim()} className="btn btn-primary">Send →</button>
        </form>

        <div className="front-hero-foot">
          <a href="#oils" className="front-hero-browse">Or browse the oils ↓</a>
          <span className="front-hero-foot-sep">·</span>
          <span className="front-hero-foot-note">
            Concept site by{" "}
            <a href="https://concierge.studio" target="_blank" rel="noreferrer">concierge.studio</a> · checkout disabled
          </span>
        </div>
      </div>
    </section>
  );
}
