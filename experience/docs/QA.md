# Final local QA — 2026-11-03

## Delivered state

Latest user direction applied: no water/refraction background effect and no added Glass UI. Preserve the existing product interaction and the five-pattern collection. The seven story sentences are compact editorial copy, not sequential full-screen text heroes. Product canvas is contained by the product frame; each section has an opaque background. Oimo Drops was inspected only, not added to this version.

## Checks passed

- `npm test`: 3 passed. Five source GLBs retain body, gold ring and separate gold pattern meshes; original PBR/baked textures and Meshopt are intact. Category/scent assignments match verified native geometry. LUUM font bytes match source SHA.
- `npm run test:browser`: 4 passed in Chromium (1.1min). Actual 1440×1000 desktop, 390×844 mobile and 320×740 narrow mobile layouts inspected.
- Every category selected and rendered: FOAM CLEANSER/03 diamond; SHAMPOO/01 grid; CONDITIONER/02 horizontal; BODY WASH/04 zigzag; BODY LOTION/05 diagonal round vessel.
- All sampled product switches stay opaque (`transparent=false`, `opacity=1`, `depthWrite=true`). No hollow-shell fade.
- Drag changes actual model rotation and temporarily holds scroll camera progress; release resumes. Arrow keys rotate the focused 3D canvas.
- Continuous pattern, ring, logo and real five-model lineup cameras work. Collection hover/focus previews the original product render; activation opens that actual GLB close-up.
- First-session real asset loader automatically dismisses after all five models, font/image essentials; reload does not repeat it.
- All seven supplied sentences remain in order; no giant Glass pane or narrative full-screen sequence remains.
- LUUM and Pretendard loaded; LUUM is applied to Latin brand/product headings, Hangul uses Pretendard fallback. No horizontal overflow at checked sizes.
- Reduced-motion preference freezes automatic object motion; water shader/canvas is absent entirely. Native vertical touch scrolling is retained (`touch-action:pan-y`).
- WebGL-disabled browser successfully uses the five genuine source-render images and working selectors.
- `npm run build`: successful. Only existing Three.js 583kB chunk size advisory remains; Three.js is dynamically loaded separately from the opening UI.
- `node qa/verify-production.mjs`: local production build at `/LUUM/`, all five models loaded, solid materials true, water effect absent, zero browser errors and zero HTTP asset errors.
- Original BLEND, supplied font and webfont SHA-256 checked again against `asset-integrity.json`: all unchanged.
- `git diff --check`: no whitespace errors.

## Visual evidence

Actual browser screenshots in `qa/`:
- `revised-opening.png`, `revised-story.png`, `revised-collection.png`
- `revised-product-01..05.png`, `revised-desktop-detail.png`, `revised-desktop-ring.png`, `revised-desktop-signature.png`, `revised-desktop-lineup.png`
- `revised-lotion-detail.png`
- `revised-mobile-opening.png`, `revised-mobile-story.png`, `revised-mobile-product.png`, `revised-mobile-lotion.png`, `revised-mobile-detail.png`, `revised-mobile-collection.png`, `revised-small-mobile.png`
- `revised-fallback.png`
- `production-opening.png`, `production-story.png`, `production-product.png`, `production-ending.png`

Reference contact sheets and actual demo screenshots were visually compared in the temporary research directory only. New reference opening was not applied after the user's instruction to return to the earlier version with water removed.

## Practical limits

Mobile checks use browser viewport emulation; physical iOS/Android GPU testing was not performed. No production deployment, push or remote publication was performed in this revision. The local Vite server remains running at http://127.0.0.1:5173/ . Work-start checkpoint: `9d9dd93`.
