// Example Next.js API route (Node) — migrate small Python endpoints here if you convert them to Node.
// Server-side secrets are available here via process.env.SECRET_API_KEY
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Next.js API', now: new Date().toISOString() })
}
