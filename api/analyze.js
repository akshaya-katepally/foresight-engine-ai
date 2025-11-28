export default async function handler(req, res) {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
    const text = body.text || ""

    const blockers = ["stuck", "blocked", "can't", "unable", "issue", "problem", "delay"]
    const stress = ["tired", "exhausted", "burnout", "overworked", "frustrated"]
    const unclear = ["confused", "unclear", "don't understand"]

    let blockerScore = blockers.some(w => text.toLowerCase().includes(w)) ? 0.6 : 0.2
    let stressScore = stress.some(w => text.toLowerCase().includes(w)) ? 0.7 : 0.3
    let clarityScore = unclear.some(w => text.toLowerCase().includes(w)) ? "Poor" : "Good"

    const risk = ((blockerScore + stressScore) / 2).toFixed(2)

    return res.status(200).json({
      success: true,
      risk: risk,
      blocker: blockerScore,
      stress: stressScore,
      clarity: clarityScore,
      summary: `Risk level is ${risk * 100}%.`,
      advice: [
        "Schedule a quick check-in.",
        "Inspect blockers and clarify expectations."
      ]
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.toString() })
  }
}
