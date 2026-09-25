import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, ChevronDown, LoaderCircle, MessageCircle, Send, ShieldCheck, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const WELCOME: Message = {
  role: "assistant",
  content: "Hi, lovely. I can help with practical booking questions, rates, availability, and how to send an enquiry. What would you like to know?",
};

const STARTERS = ["What are your rates?", "How do I book?", "Where do you travel?"];

export function AlexaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (event?: FormEvent, preset?: string) => {
    event?.preventDefault();
    const text = (preset ?? input).trim();
    if (!text || loading || text.length > 1200) return;
    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok || !data.text) throw new Error(data.error ?? "No response received.");
      setMessages((current) => [...current, { role: "assistant", content: data.text! }]);
    } catch {
      setError("I’m having a quiet moment. Please use the enquiry form and I’ll get back to you privately.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {open && (
        <section className="flex h-[min(640px,calc(100vh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-gold/25 bg-ink shadow-[0_24px_80px_-20px_#000]" aria-label="Alexa Grey booking assistant">
          <header className="flex items-center justify-between border-b border-gold/15 bg-surface px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-ink"><Bot size={19} /></span>
              <div>
                <p className="heading-serif text-xl leading-none">Alexa&apos;s concierge</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gold-dark">Private booking assistant</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-muted hover:bg-gold/10 hover:text-cream" aria-label="Close chat"><X size={18} /></button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
            <div className="flex items-start gap-2 rounded-xl border border-gold/10 bg-gold/5 p-3 text-xs leading-relaxed text-muted"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-gold" /> Strictly 18+. Please keep questions practical and booking-related.</div>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-8 rounded-2xl rounded-br-sm bg-gold px-4 py-3 text-sm leading-relaxed text-ink" : "mr-8 rounded-2xl rounded-bl-sm border border-gold/10 bg-surface px-4 py-3 text-sm leading-relaxed text-cream/90"}>
                {message.content}
              </div>
            ))}
            {messages.length === 1 && !loading && <div className="flex flex-wrap gap-2">{STARTERS.map((starter) => <button key={starter} type="button" onClick={() => void send(undefined, starter)} className="rounded-full border border-gold/25 px-3 py-2 text-xs text-gold-light hover:border-gold hover:bg-gold/10">{starter}</button>)}</div>}
            {loading && <div className="mr-8 flex items-center gap-2 rounded-2xl rounded-bl-sm border border-gold/10 bg-surface px-4 py-3 text-sm text-muted"><LoaderCircle size={15} className="animate-spin text-gold" /> Thinking…</div>}
            {error && <p className="text-xs leading-relaxed text-danger">{error}</p>}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="border-t border-gold/15 bg-surface p-3">
            <label className="sr-only" htmlFor="alexa-chat-message">Message Alexa&apos;s concierge</label>
            <div className="flex items-end gap-2 rounded-xl border border-gold/15 bg-ink px-3 py-2 focus-within:border-gold/60">
              <textarea id="alexa-chat-message" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); void send(); } }} rows={1} maxLength={1200} placeholder="Ask about booking…" className="min-h-10 flex-1 resize-none bg-transparent py-2 text-sm text-cream outline-none placeholder:text-muted/60" />
              <button type="submit" disabled={loading || !input.trim()} className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-ink transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message"><Send size={16} /></button>
            </div>
            <p className="mt-2 px-1 text-[10px] text-muted/70">No booking is confirmed in chat. Use the enquiry form for private details.</p>
          </form>
        </section>
      )}
      <button type="button" onClick={() => setOpen((value) => !value)} className="btn-gold shadow-[0_12px_40px_-12px_#d4af37]" aria-expanded={open} aria-controls="alexa-chat-message">
        {open ? <ChevronDown size={17} /> : <MessageCircle size={17} />}
        {open ? "Minimise" : "Chat with Alexa"}
      </button>
    </div>
  );
}
