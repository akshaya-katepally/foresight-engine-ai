export default async function handler(req, res) {
  // Handle GET request (browser test)
  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "API is working. Send POST with { text: \"your message\" }"
    });
  }

  // Only POST messages are processed
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  // Read body
  let body = req.body;

  // Fix for Vercel raw text body issue
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: "Invalid JSON format"
      });
    }
  }

  // Validate input
  if (!body || !body.text) {
    return res.status(400).json({
      success: false,
      error: "Missing 'text' in request. Send { text: \"your message\" }"
    });
  }

  const msg = body.text.toLowerCase();

  // Keyword scoring
  const blockerWords = ["stuck", "blocked", "delay", "issue", "problem"];
  const stressWords = ["tired", "exhausted", "burnout", "overworked"];
  const confusionWords = ["confused", "unclear", "don't understand"];

  let blocker = 0, stress = 0, confusion = 0;

  blockerWords.forEach(w => { if (msg.includes(w)) blocker += 20; });
  stressWords.forEach(w => { if (msg.includes(w)) stress += 20; });
  confusionWords.forEach(w => { if (msg.includes(w)) confusion += 20; });

  const risk = Math.min(100, blocker + stress + confusion);

  return res.status(200).json({
    success: true,
    input: msg,
    scores: { blocker, stress, confusion, risk },
    summary: `Risk Score: ${risk}%`
  });
}
