export const config = {
  maxDuration: 30,
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY not set. Go to Vercel > Settings > Environment Variables and add it." });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { prompt, max_tokens = 2000 } = body || {};
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens,
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a movie recommendation API. You MUST respond with valid JSON only. Use double quotes for all keys and string values. Never use single quotes. Never use trailing commas. Never include comments. Do not use apostrophes in text - write cannot instead of can't, do not instead of don't, it is instead of it's." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(r.status).json({ error: "Groq API " + r.status + ": " + errText.slice(0, 200) });
    }

    const data = await r.json();
    if (data.error) {
      return res.status(500).json({ error: "Groq error: " + (data.error.message || JSON.stringify(data.error)) });
    }

    const text = data.choices?.[0]?.message?.content || "";
    if (!text) {
      return res.status(500).json({ error: "Groq returned empty response" });
    }

    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: "Server error: " + (e.message || "unknown") });
  }
}
