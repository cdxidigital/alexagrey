import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { createFileRoute } from "@tanstack/react-router";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1200;

const SYSTEM_PROMPT = `You are Alexa Grey's discreet booking concierge for an adults-only independent companion based in Perth, WA.

Help visitors with practical, non-explicit questions about availability, booking lengths, outcall logistics, rates, boundaries, screening, and how to send an enquiry. Keep replies warm, concise, and polished in Australian English. Do not invent availability, locations, contact details, services, or prices. If a detail is not present in the site context, say that Alexa will confirm it through the enquiry form.

Keep the conversation non-explicit. Do not generate sexual descriptions, erotic roleplay, sexual instructions, or graphic content. Redirect those requests to practical booking information. Never claim to be Alexa herself or promise a booking. Remind visitors that the site is strictly 18+ when relevant, and encourage them to use the enquiry form for private details.

Known site context:
- Alexa Grey is independent and based in Perth, WA.
- Outcall only.
- Rates: 30 minutes $500, 1 hour $800, 2 hours $1,500. Overnight is enquire-only.
- Enquiries should include preferred timing, location/suburb or hotel, contact details, duration, and any extras.
- New clients may be asked to complete screening.
- Enquiries are confidential.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) throw new Error("Invalid messages.");
  return raw
    .slice(-MAX_MESSAGES)
    .map((item) => {
      if (!item || typeof item !== "object") throw new Error("Invalid message.");
      const value = item as { role?: unknown; content?: unknown };
      const role = value.role === "assistant" ? "assistant" : value.role === "user" ? "user" : null;
      const content = typeof value.content === "string" ? value.content.trim() : "";
      if (!role || !content || content.length > MAX_MESSAGE_LENGTH) {
        throw new Error("Message is empty or too long.");
      }
      return { role, content };
    });
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { messages?: unknown };
          const messages = parseMessages(body.messages);
          const result = await generateText({
            model: gateway("openai/gpt-5-mini"),
            system: SYSTEM_PROMPT,
            messages,
            maxOutputTokens: 350,
            temperature: 0.7,
          });
          return Response.json({ text: result.text });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to respond right now.";
          const status = message.startsWith("Invalid") || message.includes("too long") ? 400 : 500;
          return Response.json({ error: status === 400 ? message : "Unable to respond right now." }, { status });
        }
      },
    },
  },
});

// Keep this route server-only: the model call and prompt must never ship to the browser.
