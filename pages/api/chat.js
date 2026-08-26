// Vercel serverless function — proxies chat requests to OpenAI so the API
// key (OPENAI_API_KEY, set in Vercel project env vars) never reaches the browser.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not set in the server environment.' });
  }

  const { system, messages, model } = req.body || {};

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        max_tokens: 700,
        messages: [{ role: 'system', content: system || '' }].concat(messages || []),
      }),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: String(err) });
  }
}
