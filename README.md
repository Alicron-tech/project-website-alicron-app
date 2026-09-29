# ALICRON website: application code

Next.js front end, Sanity Studio, content seed and generated media for the ALICRON website.
The brief, structure, media inventory and decision log live in the SV Holding repository at
`/Users/alecbedzir/vaimo_and_work/project-SV-holding/website-alicron-blueprint/` (start with its README).
Git: branch `master`, remote `nomicore/project-website-alicron-app`. Everything under `generated/` stays out of git (global ignore); so does `web/public/hero/`.

## Where things run

| Piece | Where | Notes |
| --- | --- | --- |
| Website | Vercel project `alicron-website` in team "Kuba" (account alec.bedzir@alicron.net): https://alicron-website-one.vercel.app | Password gate on every page, `noindex` headers, `robots.txt` disallows all. Vercel Authentication is switched off on the project so the gate is the only barrier |
| Content | Sanity project "Alicron" (`wividiap`), dataset `production` | Public read; edits need a Sanity login |
| Studio (editor) | `https://alicron.sanity.studio` | Deployed from `studio/`; invite editors in sanity.io/manage |

Password: the site reads `SITE_PASSWORD` from the environment. Until that variable is set in the
hosting project, the default in `web/src/lib/gate.ts` applies. The cookie lasts 30 days.

## Folders

| Path | Contents |
| --- | --- |
| `web/` | Next.js 16 app (App Router, `src/`). Routes: `/[locale]`, `/[locale]/[slug]` for the static pages, `/[locale]/platforms/[slug]`, `/[locale]/applications/[slug]`, `/gate`, `/api/gate`. `src/proxy.ts` holds the password gate and the locale redirect |
| `studio/` | Sanity Studio: schema in `schemas/`, hosted at alicron.sanity.studio |
| `seed/` | The whole site copy in `content.mjs` (EN and ES side by side) and `seed.mjs`, which uploads images and documents. Re-running it overwrites what editors changed in the Studio, so after hand-off treat the Studio as the source and this file as history |
| `generated/` | fal.ai stills (`img/`, prompts in `gen_images.py`), downscaled studio photos (`photos/`), the six Pexels clips plus posters (`video/`, ffmpeg 1080p, no audio, 20 s max), and every background-drawing iteration (`sketches/`, generators `gen_sketches*.py`). What each file is for: the blueprint's `docs/media.md` |

## Content model

Every text field is an object with `en` and `es`. Paragraph fields separate paragraphs with a
blank line. Documents: `siteSettings` (one), `page` (nine, addressed by slug), `platform`
(seven airframe classes), `application` (five), `offering` (software, training and engineering
items, by `category`). Pages are a hero plus an ordered list of sections of eight kinds: prose,
feature grid, media band, figures strip, dark band, referenced cards, call to action, two columns.

Video placeholders: a `media` object with `isVideoPlaceholder` on shows the poster image with a
play mark and a "coming soon" tag. Set `videoUrl` to an mp4 or HLS URL and the same place renders
a muted looping video with that poster. No placeholders remain: the home hero, the home field case, the pipeline, crop and power-line applications and the training page all carry stock clips (Sanity file assets; sources in the blueprint's `docs/media.md`). Clips play only while in view, through `InViewVideo.tsx`. Pages whose first screen has a clip show no background drawing; the others show one of two wireframe meshes (`Sketch.tsx`, files in `web/public/sketches/`).

## Working on it

```bash
# front end
cd web && pnpm install && pnpm dev            # http://localhost:3000, gate on
GATE_DISABLED=1 pnpm dev                       # skip the password locally

# studio
cd studio && pnpm install && pnpm dev          # http://localhost:3333
source ~/.config/sanity/alicron.env && NODE_OPTIONS=--max-old-space-size=8192 pnpm exec sanity deploy --yes

# content (first load or a full reset)
cd seed && pnpm install && source ~/.config/sanity/alicron.env && node seed.mjs

# images
source ~/.zshenv && python3 generated/gen_images.py   # only generates what is missing
```

Deploying the front end (Hobby teams cannot import private organisation repositories, so the CLI is the path):

```bash
cd web && source ~/.zshenv
pnpm dlx vercel@latest deploy --prod --yes --token "$VERCEL_TOKEN_KUBA" --scope kuba-7a66
```

The folder is linked to the project (`.vercel/`, ignored by git) and `SITE_PASSWORD` is set in the
project's production environment.

Each folder carries its own `pnpm-workspace.yaml` so pnpm never walks up to a parent directory.
Local secrets on Alec's machine (never in this folder or the repository):

| Where | Variables | Used by |
| --- | --- | --- |
| `~/.config/sanity/alicron.env` | `SANITY_TOKEN`, `SANITY_AUTH_TOKEN`, project and dataset | seed script, Studio deploy |
| `~/.zshenv` | `VERCEL_TOKEN_KUBA` (Kuba team, slug `kuba-7a66`), `FAL_KEY`, `PEXELS_API_KEY`, `PIXABAY_API_KEY` | deploys, image generation, clip search |
| `~/.config/plytix/sv-holding.env` | Plytix API credentials | the PIM, unrelated to the site |

The site's password is `SITE_PASSWORD` in the Vercel project (default value in `web/src/lib/gate.ts`).

## Design

The visual layer implements the ALICRON Design System (claude.ai/design project
`ffb90b60-ce21-4759-b661-3c06e05773dd`). Tokens live in `web/src/app/globals.css`; the components in
`web/src/components` are CSS re-implementations of the system's Button, TacticalButton, PillLink,
StatBlock, SpecRow, CaseCard, ProductTile, MediaFrame, CtaBanner, SiteHeader and footer patterns.
When the design system changes, update the tokens block first, then the classes named after the
components. Number formatting per locale is applied at render time in `web/src/lib/sanity.ts`.

## Sanity writing rule

Every object inside an array (references, gallery images, stats, sections) must carry a unique `_key`;
`seed.mjs` adds one in `resolve()`. Without it the Studio shows "Missing keys" and the list is read-only.

## Rules the content follows

- Civil framing. Inspection, agriculture, mapping, emergencies, training, engineering.
- Airframes are named by class and link type, never by a brand or model name.
- Figures are class figures from the current configurations, with the configuration stated.
- Spanish is written as native copy, not translated word for word.
- Brand-free photography: no insignia, no third-party logos, no uniforms.

## Home hero film: backup and local preview

- The live hero media (Mallorca clip) is backed up in `seed/backups/2026-09-29-home-hero-mallorca.json`; the clip and poster are in `generated/video/`. Restore with `source ~/.config/sanity/alicron.env && node seed/restore-hero.mjs seed/backups/2026-09-29-home-hero-mallorca.json`.
- Local preview of another film without touching Sanity: `web/.env.local` sets `HERO_VIDEO_OVERRIDE` and `HERO_POSTER_OVERRIDE` (files in `web/public/hero/`, not committed) and `HERO_DIM_DEFAULT` (0 to 4). On the page, `?dim=0..4`, `?rate=0.7` and `?tune` (a small switcher panel) adjust the dark dim and the playback speed live.
