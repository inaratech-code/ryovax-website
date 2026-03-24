# Admin panel — production checklist

Use this when deploying (e.g. **Cloudflare Pages** with a Next.js adapter, or any host that injects environment variables at build/runtime).

## 1. Expose the admin UI in production

The app **hides** `/admin` unless you opt in:

| Variable | Value | Notes |
|----------|--------|--------|
| `ADMIN_PANEL_ENABLED` | `true` | Required in production (not `development`). Without it, `/admin` redirects to `/`. |

Local `next dev` ignores this and always allows `/admin` for development.

## 2. Admin login (recommended for production)

If these are **unset**, anyone who can reach `/admin` can use the panel once `ADMIN_PANEL_ENABLED` is on. Set all three when you want a password (and optional login id):

| Variable | Required | Notes |
|----------|----------|--------|
| `ADMIN_PASSWORD` | Yes, to enable login | Strong secret; stored only in host env. |
| `ADMIN_SESSION_SECRET` | Yes, when using password | Random string, **16+ characters**; signs the httpOnly session cookie. |
| `ADMIN_USERNAME` | No | If set, the login form requires this **Admin ID** plus password. |

After deploy, open **`/admin`** or **`/admin/login`**, sign in, then confirm you reach the dashboard.

## 3. Firebase / Firestore (server)

The server needs credentials **without** relying on a local file path (Cloudflare has no `C:/...` key file on disk).

| Variable | Notes |
|----------|--------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Single-line JSON for the Firebase **service account** (same content as the downloaded `.json` file). Set as an **encrypted** / **secret** variable in Cloudflare. |

Do **not** commit this value. Rotate the key if it was ever exposed.

Optional locally: `GOOGLE_APPLICATION_CREDENTIALS` pointing at a file path — fine on your machine only.

### Client (browser) — Analytics

Set **`NEXT_PUBLIC_FIREBASE_*`** from **Firebase Console → Project settings → Your apps → Web app** (the same fields as the `firebaseConfig` snippet). The app initializes **Firebase App + Analytics** on the client when these are present. Values are **public** in the JS bundle; restrict **authorized domains** in Firebase Console.

## 4. Other useful vars

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata/links, e.g. `https://www.yourdomain.com`. |
| `ADMIN_PANEL_TIMEZONE` | IANA timezone for appointment display in the admin UI (e.g. `Asia/Kolkata`). |

## 5. Cloudflare (Pages) — where to put secrets

1. Open your **Cloudflare dashboard** → **Workers & Pages** → your **Pages** project (or the project that builds Next.js).
2. Go to **Settings** → **Environment variables** (and **Variables and Secrets** if using Workers).
3. Add **production** (and **preview** if you use branch previews) variables:
   - `ADMIN_PANEL_ENABLED` = `true` (plain text is fine).
   - `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `FIREBASE_SERVICE_ACCOUNT_JSON` — mark as **secret** / encrypted where the UI allows.
4. **Redeploy** after changing variables so the new runtime env is picked up.

Exact UI labels differ slightly between Pages and Workers; the goal is the same: production env for the Next server.

## 6. Smoke test after deploy

1. Open the public site; confirm the home page loads.
2. Use the **subtle footer link** (small dot after “All rights reserved.”) or go to `https://your-domain/admin`.
3. You should get **`/admin/login`** if password auth is configured, or the dashboard if not.
4. Sign in and open **Overview**, **Approvals**, or **POV & testimonials** and confirm data loads (Firestore).
5. Click **Log out** and confirm you cannot access `/admin` without signing in again.

## 7. Firebase Admin on edge hosts

Some hosts run Next in an **edge** runtime. If Firestore calls fail at runtime, check your adapter’s **Node.js compatibility** settings or host docs; you may need routes that use `firebase-admin` to run in a **Node** runtime. Fix any failures before relying on production admin workflows.
