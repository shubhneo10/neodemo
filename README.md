# neodemo

Next.js serverless replica of the NeoSapients scroll-deck, built to deploy on Vercel. The deck itself is served as a static file; the Q&A assistant's OpenAI calls run through a serverless function so the API key never reaches the browser.

## Structure

- `public/deck.html` — the scroll-deck (static HTML/CSS/JS)
- `public/support.js`, `public/assets/` — runtime and images the deck depends on
- `pages/api/chat.js` — serverless function that proxies chat requests to OpenAI using `OPENAI_API_KEY` from the server environment
- `next.config.js` — rewrites `/` to `/deck.html`

## Local development

```bash
npm install
cp .env.example .env.local   # then paste your real OpenAI key
npm run dev
```

Open the printed local URL. In the deck's ⚙ settings, set the answer engine to OpenAI — no key needs to be entered in the UI, it's read from the server.

## Deploy to Vercel

```bash
vercel
```

Then in the Vercel project settings, add an environment variable:

- `OPENAI_API_KEY` — your OpenAI API key

Redeploy after adding it. The key stays server-side; only `pages/api/chat.js` reads it.
