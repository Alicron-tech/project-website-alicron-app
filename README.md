# ALICRON website: application code

Next.js front end, Sanity Studio, content seed and generated imagery for alicron's website.
The brief, structure and decisions live in the SV Holding repository under
`website-alicron-blueprint/` (`docs/site-structure.md`, `README.md`).

## Where things run

| Piece | Where | Notes |
| --- | --- | --- |
| Website | Vercel project `alicron-website` (team "Alec Vaimo Projects"), pending a deployment permission | Password gate on every page, `noindex` headers, `robots.txt` disallows all |
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
| `generated/` | Images made on fal.ai for the site (`img/`, prompts in `gen_images.py`) and downscaled studio photos (`photos/`) |

## Content model

Every text field is an object with `en` and `es`. Paragraph fields separate paragraphs with a
blank line. Documents: `siteSettings` (one), `page` (nine, addressed by slug), `platform`
(seven airframe classes), `application` (five), `offering` (software, training and engineering
items, by `category`). Pages are a hero plus an ordered list of sections of eight kinds: prose,
feature grid, media band, figures strip, dark band, referenced cards, call to action, two columns.

Video placeholders: a `media` object with `isVideoPlaceholder` on shows the poster image with a
play mark and a "coming soon" tag. Set `videoUrl` to an mp4 or HLS URL and the same place renders
a muted looping video with that poster. Three are in place: the home hero, the pipeline case, the
training page.

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

Each folder carries its own `pnpm-workspace.yaml` so pnpm never walks up to a parent directory.
Each partner keeps the Sanity token in a local env file (`~/.config/sanity/alicron.env`,
variables `SANITY_TOKEN` and `SANITY_AUTH_TOKEN`). Nothing secret is in this folder.

## Rules the content follows

- Civil framing. Inspection, agriculture, mapping, emergencies, training, engineering.
- Airframes are named by class and link type, never by a brand or model name.
- Figures are class figures from the current configurations, with the configuration stated.
- Spanish is written as native copy, not translated word for word.
- Brand-free photography: no insignia, no third-party logos, no uniforms.
