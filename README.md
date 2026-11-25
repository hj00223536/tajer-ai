# TAJER AI

Bilingual (Arabic/English) AI-assisted marketing workspace built with Next.js App Router, React and TypeScript.

## Features
- Arabic RTL and English LTR interface
- Marketing ad, social post and product description generator
- Optional OpenAI-compatible provider through a server-side API route
- Safe template fallback when no provider is configured
- Session-only saved drafts (not persistent storage)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## AI provider configuration
Set these variables in the hosting provider's server environment settings:

- `AI_API_URL`: OpenAI-compatible chat completions URL
- `AI_API_KEY`: secret API key (never commit it)
- `AI_MODEL`: model name supported by your provider

Without these variables, the app uses local template responses. Do not put secrets in client-side code or GitHub.

## Deploy to Vercel
Import this GitHub repository into Vercel, keep the Next.js framework preset, and deploy. Add the AI variables under Project Settings → Environment Variables, then redeploy.

## Current MVP limitations
This is a functional starter MVP, not yet a complete commercial SaaS. It has no user authentication, database-backed drafts, payment processing, subscription management, admin console, quotas, or production monitoring. Drafts are held in browser memory and disappear on refresh. Validate provider costs and terms before enabling public access.
