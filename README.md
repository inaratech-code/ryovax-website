# Ryovax website

Ryovax is a modern B2B procurement and sourcing platform combining global supplier discovery, RFQ management, and logistics services. Built with a clean SaaS UI, smooth Lenis scrolling, and immersive 3D visuals for a premium user experience.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech stack

This is a [Next.js](https://nextjs.org) app. See the [Next.js documentation](https://nextjs.org/docs) for deployment and advanced topics.

## Deploy

The easiest path is [Vercel](https://vercel.com/new) — see [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

For **Cloudflare** (or any host), configure env vars for Firebase and the admin panel; see **[docs/admin-production-checklist.md](docs/admin-production-checklist.md)**. A low-visibility **admin** entry point is the small **·** link after “All rights reserved.” in the site footer (still protected by `ADMIN_PANEL_ENABLED` and optional `/admin/login` in production).
