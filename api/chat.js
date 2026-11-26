// Vercel serverless endpoint. The OpenAI key is read only from server environment variables.
const SYSTEM_PROMPT = `You are Y33Py, the AI assistant inside Y33Py.JAILBREAK, created by Tagzz.
Your motto is THINK • BUILD • ANALYZE • CREATE.
Be clear, curious, practical, friendly, and honest. Adapt to the user's task.
Help with learning, coding, creative work, analysis, and project planning.
Never claim to have accessed files, websites, accounts, or systems unless a tool actually did so.
Do not ask users to share passwords, API keys, or private credentials.
If a request is unsafe or inappropriate, set a safe boundary and offer a safe alternative.`;

const requestCounts = new Map();\nconst WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();\n  const now = Date.now();
  const previous = requestCounts.get(ip);
  if (!previous || now - previous.startedAt >= WINDOW_MS) requestCounts.set(ip, { startedAt: now, count: 1 });
  else if (previous.count >= MAX_REQUESTS_PER_WINDOW) return res.status(429).json({ error: "Too many messages right now. Please wait a minute and try again." });
  else previous.count += 1;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "Y33Py is not configured yet. The server is missing its API key." });

  try {
    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length || messages.length > 20) return res.status(400).json({ error: "Send between 1 and 20 messages." });

    const safeMessages = messages.map((m) => {
      if (!m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string") {
        throw new Error("Invalid message format.");
      }
      return { role: m.role, content: m.content.slice(0, 8000) };
    });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: SYSTEM_PROMPT,
        input: safeMessages,
        max_output_tokens: 1200
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", data.error?.type || response.status);
      return res.status(502).json({ error: "The AI service could not complete that request. Please try again." });
    }

    const answer = (data.output || [])
      .flatMap((item) => item.content || [])
      .filter((part) => part.type === "output_text")
      .map((part) => part.text)
      .join("\n")
      .trim();

    if (!answer) return res.status(502).json({ error: "Y33Py received an empty response. Please try again." });
    return res.status(200).json({ reply: answer });
  } catch (error) {
    console.error("Y33Py chat error:", error.message);
    return res.status(400).json({ error: "Invalid request. Please check your message and try again." });
  }
};