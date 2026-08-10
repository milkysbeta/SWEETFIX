# Sweetfix

Marketing site for **Matt Sweetman** — builder, fixer, maker. Queenstown &
Wanaka, available worldwide.

Vite · React 19 · TypeScript · Tailwind v4 · three.js · Framer Motion.
Static build, deploys to GitHub Pages.

---

## Running it locally

You'll need [Node.js 22+](https://nodejs.org).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build
```

## Where everything lives

| What | Where |
| --- | --- |
| **All the words, phone, email, services, projects** | `src/lib/site.ts` |
| Photos | `public/images/work/` — see the README in there |
| Logo (React) | `src/components/Logo.tsx` |
| Logo (standalone SVG) | `brand/sweetfix-mark.svg` |
| Page sections | `src/components/` |
| Client review questionnaire | `src/pages/ReviewQuestionnaire.tsx` → `/#/reviews` |
| Matt's own questionnaire | `src/pages/AboutQuestionnaire.tsx` → `/#/about-questions` |

**Almost every change you'll want to make is in `src/lib/site.ts`.** Phone
number, services, project list, credentials — all one file.

---

## Things that still need doing

Each is marked `TODO(matt)` in the code.

### 1. Turn the forms on — 5 minutes

Right now the enquiry form and both questionnaires fall back to opening your
email app. To make them send properly:

1. Go to [web3forms.com](https://web3forms.com), enter the email you want
   enquiries to land in, and they'll email you an access key.
2. Paste it into `src/lib/site.ts`:
   ```ts
   formAccessKey: 'paste-the-key-here',
   ```
3. Push. Done — free, unlimited, no account to maintain.

The key is safe to commit; it only allows sending *to* your address.

### 2. Photos

Drop them into `public/images/work/<project-id>/` and list them in
`site.ts`. Full instructions in `public/images/work/README.md`. **Resize
them first** — a 6 MB phone photo will make the site crawl.

### 3. Your story

Open `/#/about-questions`, answer what you can, send it. That gets turned
into the About section in your own words. Right now it's a stand-in.

### 4. Reviews

Send `https://sweetfix.nz/#/reviews` to past clients and employers. Answers
come to your inbox. Add them to the `testimonials` array in `site.ts` — the
section stays completely hidden until there's at least one, so nothing looks
empty in the meantime.

### 5. NZBN

Add it to `site.ts` and it appears in the footer automatically.

---

## Publishing

### GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes on every
push to `main`. One-time setup:

1. Repo **Settings → Pages → Source → GitHub Actions**.
2. Push to `main`. About a minute later it's live.

### Custom domain — sweetfix.nz

`public/CNAME` already contains `sweetfix.nz`, so GitHub will pick it up.
At your DNS provider, point the domain at GitHub Pages:

**Apex (`sweetfix.nz`) — four A records:**

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**And a CNAME for `www`:**

```
www  →  <your-github-username>.github.io
```

Then in **Settings → Pages**, enter `sweetfix.nz` as the custom domain and
tick **Enforce HTTPS** once the certificate is issued (can take an hour).

### Email on the domain

GitHub Pages does not do email. Cheapest working setup: point the domain's
DNS at Cloudflare (free), then turn on **Cloudflare Email Routing** and
forward `info@sweetfix.nz` to your Gmail. Free, unlimited addresses.

Once that's live, `site.emailFallback` can be removed from `site.ts` and the
site will use `info@sweetfix.nz` everywhere.

---

## Notes on the build

- **three.js is lazy-loaded.** The hero dust is a separate chunk, so the
  headline and phone number render before it downloads. Initial load is
  ~117 KB gzipped.
- **Reduced motion is respected** throughout — the dust stops drifting and
  parallax switches off for anyone who's asked their device for less
  animation.
- **No stock photography.** Projects without photos show an honest "photo
  coming" plate rather than someone else's work.
- **Client names.** The Queenstown renovation is deliberately unnamed. Don't
  put a client's name or identifiable photos of their home on the public site
  without their written permission.
