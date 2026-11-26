# Y33Py.JAILBREAK

**THINK • BUILD • ANALYZE • CREATE**

A creator-led AI workspace by **Tagzz**.

## What's included
- Responsive chat interface in `index.html`
- Server-side OpenAI Responses API endpoint in `api/chat.js`
- Y33Py assistant instructions stored on the server
- Basic per-instance IP request throttling and security headers
- Vercel configuration in `vercel.json`

## Deploy the website and backend with Vercel
GitHub Pages can host the static page, but it cannot run this serverless API. Deploy this repository to Vercel so the website and `/api/chat` endpoint run together.

1. Connect your GitHub repository to a Vercel project.
2. Deploy the project with the default settings (the root `index.html` and `api/chat.js` are detected automatically).
3. In the Vercel project settings, add an Environment Variable named `OPENAI_API_KEY` and set its value privately. Never paste the key into GitHub, the website, or a chat.
4. Optionally set `OPENAI_MODEL` to a model available to your API project. The default is `gpt-4.1-mini`.
5. Redeploy after adding or changing environment variables.
6. Open the Vercel deployment URL and send a test message.

An adult should help manage the API account, payment settings, and secret configuration. API usage may incur charges.

## Important security notes
- Never commit API keys, passwords, or tokens.
- The included in-memory IP throttle is best-effort and may reset between serverless instances. It is not a substitute for production-grade abuse prevention, quotas, or monitoring.
- Before sharing the public chat widely, add robust rate limiting/usage limits and monitor API spend.
- The endpoint limits each message and the number of messages in a request. Do not send sensitive personal information.

## GitHub Pages
GitHub Pages can publish only the static frontend. It will not run `api/chat.js`, so the live chat will not work from a GitHub Pages URL. Use the Vercel deployment URL for the connected AI website.

## Project owner
Created by **Tagzz**.
