async function sha256Hex(text) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};
  const user = process.env.SITE_USERNAME || 'neoadmin';
  const pass = process.env.SITE_PASSWORD || 'Neo@2026';
  const secret = process.env.SESSION_SECRET || 'ns-dev-secret-change-me';

  if (username !== user || password !== pass) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = await sha256Hex(`${user}:${pass}:${secret}`);
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', [
    `ns_auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${isProd ? '; Secure' : ''}`,
  ]);
  return res.status(200).json({ ok: true });
}
