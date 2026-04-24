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
          { role: "system", content: "You are a movie recommendation API. STRICT RULES: 1) Only recommend movies that actually exist and are real - never invent or fabricate titles. 2) Be extremely strict about genre/mood matching. An action movie is NOT romance. A cop thriller is NOT romance. A sad drama is NOT comedy. Only suggest movies that genuinely match the requested mood. 3) NEVER suggest platforms the user did not select. NEVER suggest alternative platforms. If unsure about platform, leave platforms empty. 4) If you cannot find enough movies matching all criteria, return fewer movies. 2 correct movies is better than 4 wrong ones. 5) Keep whyWatch under 15 words. 6) Keep matchNote under 10 words, only for imperfect matches. FORMAT: Valid JSON, double quotes only, no apostrophes (write do not instead of don't), no trailing commas." },
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
