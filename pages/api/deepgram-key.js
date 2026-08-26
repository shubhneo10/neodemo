// Returns the Deepgram key from server env so the client doesn't need it typed
// into settings. Note: this ships the raw key to the browser (same trust model
// as the original file's manual key entry) — it just skips the manual paste step.
export default function handler(req, res) {
  const key = process.env.DEEPGRAM_API_KEY || '';
  res.status(200).json({ key });
}
