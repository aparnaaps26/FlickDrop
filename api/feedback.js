export const config = {
  maxDuration: 10,
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { type, text, screen, time } = body || {};
  if (!type || !text) return res.status(400).json({ error: "Missing type or text" });

  // Forward to Google Sheets via Apps Script webhook
  const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, text, screen: screen || "Not specified", time: time || new Date().toISOString() }),
      });
    } catch (e) {
      console.error("Webhook error:", e.message);
    }
  }

  return res.status(200).json({ success: true });
}
