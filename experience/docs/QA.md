# Local QA — 2026-11-03, final feedback revision

Current release: the condensation texture and gray-green background color stay opaque and unchanged. Tracing darkens only the existing 1px geometric guide lines; it never reveals a sharp image or paints broad freehand strokes. The full-frame surface is static, with only the small guide region redrawn during input. Pattern view, reset and keyboard controls remain available.

Targeted desktop tracing across all five guides and mobile touch/scroll checks passed (2 cases, 17.9s). Reset restores the exact original background pixels; opacity remains 255 throughout.

Release checks: 3 source/model/font checks passed; production build passed. The built site was served at `/LUUM/` and checked in Chromium: five opaque GLBs loaded, original film played at 0.3× (12 decoded frames, zero dropped frames during the sample), no HTTP/console errors. A sample horizontal trace changed 1,047 pixels and left every background pixel opaque.


## Motion follow-up

Removed the artificial camera hold after reproducing a scroll target of camera 1 remaining at camera 0 through repeated samples. Existing render-time clamping could extend the hold under slow frames. Scroll now feeds the camera immediately; there is no added entrance delay. Outgoing pose continuity and opaque materials remain intact. Indicator is only small 2px dots and a 1px active line, without a connecting track.

Targeted verification passed: rapid forward/reverse scroll responsiveness plus drawing/style regression (1 case, 40.1s), all five product/camera passages and drag/keyboard priority (2 cases, 1.4m), 3 source checks and the final build. Screenshots were reviewed. The prior complete-flow validation below remains the baseline; this follow-up changes product motion and indicator styling only.

## Implemented result

The first view retains the same soft-blurred original fabric film and original header while the two original English entry phrases appear in order, followed by ENTER THE ROOM. There is no separate black gate, center wordmark or fake progress. Essential GLBs/fonts must be ready before entry. The user enters the same visual space; scrolling lifts a 24px Gaussian background blur with a feathered upward mask. Native video is unchanged at 0.3×.

The seven exact brand sentences are small (14–17px), centered, and start as the frost opens. Their final line completes before the departure interval. Scroll-linked text has no delayed scrub. Switching motion preferences no longer resets the page to the opening. Reduced-motion entry preserves both phrases and keyboard entry; focus moves into the opening heading.

All five original GLBs retain their geometry and solid PBR materials. Each has a separate scroll-controlled whole-object arrival and detail/ring/signature passage. Switching retains the outgoing rendered transform, so its close-up does not snap to the incoming whole-object pose. The follow-up removes the artificial 2.2-second camera hold and extra 0.2-second entrance delay: camera progress follows scroll directly with the existing damping, and opaque product switches take 1.7 seconds. Original BODY LOTION height/ground relationship remains intact.

Latest screenshot feedback removes glass from description panels and the right chapter rail. Follow-up feedback further simplifies the rail: 2px dots and a 1px active line, with no connecting track or enclosing surface. Actual action buttons retain one clear glass style. Product labels have at least 30px of bottom clearance at the desktop target.

The former simultaneous five-pattern grid/slider is now a long drawing atelier: 700svh desktop / 800svh mobile, with only one pattern foregrounded at a time. The original geometric guides and product metadata remain. Mouse/touch draws actual Canvas 2D gold strokes, retained per pattern across navigation. Guide visibility, reset and 3D detail return work. Broad color/light blending replaces the abrupt product/collection seam; the earlier accidental horizontal overlay edge was corrected after screenshot review.

Footer is a compact directory with one short brand phrase, product links, user-supplied website/Instagram links and copyright. Repeated story statements and oversized footer heading were removed. No invented address or business information.

## Validation passed

- `npm test`: 3 source checks passed: all five actual GLBs, distinct gold geometry/rings and baked body maps, correct category/pattern/scent mapping, original LUUM font bytes.
- Browser verification: 9 distinct cases passed. Base experience/opening suite: 6 passed in 2.4m. Refinement suite: 3 passed in 41.9s. Desktop 1440×1000; mobile 390×844 and narrow 320×740; touch-device emulation.
- All five products selected through scroll and menus; whole-object entrance, pattern/ring/logo cameras, outgoing close-up preservation, solid surfaces and native final lineup proportions checked against actual scene diagnostics and screenshots.
- BODY LOTION native height ratio 0.4095 (7.78cm / 19cm). Final lineup has equal scale factors and aligned native bases.
- Drag priority and keyboard rotation passed. Pattern navigation, drawing in all five patterns, retained strokes and reset passed. Touch draws real pixels without scrolling the drawing surface; swiping outside the surface scrolls the page.
- Original header geometry checked against the local LUUM_WEB source: at 1440px, 18px outer inset, 90px navigation gaps and 9px UI. Original Login remains a placeholder, with no account backend invented.
- Native video decoded real frames; pause/resume, offscreen pause, reduced-motion pause, unchanged video filter and 24px background blur checked. Brand story order, text sizes/centering, completion/hold, session gate skipping and forced `?intro=1` replay checked.
- WebGL-disabled image fallback works for all five products. LUUM and Pretendard loaded, with no horizontal overflow in tested viewports.
- `npm run build`: passed. Existing 583kB Three.js chunk advisory remains; it is separately split from the entry bundle.
- `node qa/verify-production.mjs`: final static build served locally at `/LUUM/`; no console/HTTP errors, five solid models and actual drawing verified. WebM fallback decoded at 1280px / 0.3×, 12 frames in 1.6s, zero dropped frames recorded.
- Original Blender, source font and web font SHA-256 values match `docs/asset-integrity.json`. `git diff --check` passed.

## Visual evidence

Actual browser captures were reviewed, including `qa/final-entry-copy.png`, `final-soft-blur.png`, `final-story-start.png`, `final-story-complete.png`; `qa/revised-product-01..05.png`, detail/ring/signature/lineup/mobile/fallback; `qa/refined-before-switch.png`, `refined-switch-start.png`, `refined-switch-arrival.png`, `refined-switch-detail.png`, `refined-clean-detail.png`; `qa/refined-pattern-drawing-0.png`, `refined-pattern-drawing-4.png`, `refined-mobile-drawing.png`; and the final `qa/production-opening.png`, `production-story.png`, `production-product.png`, `production-pattern-drawing.png`, `production-ending.png`.

Obsolete untracked captures from abandoned effects/cards were removed; tracked/original files and reversible local checkpoints were preserved.

## Performance and practical limits

720p MP4 with WebM fallback; desktop DPR capped at 1.5 / mobile at 1.25. Video and 3D rendering stop offscreen. Drawing is event-driven and capped at 1.5 DPR, 60 strokes of at most 1500 points per pattern. No extra product GLB loads or renderers in the atelier. CSS background blur is restricted to the opening/header and small buttons, not a full 3D overlay.

Mobile/touch checks use Chromium device/viewport emulation, not physical phones. The test Chromium uses WebM because its H264 codec is unavailable; MP4 remains first for browsers with H264 support. Current changes are local only; no new push/deployment. Active development server: http://127.0.0.1:5173/ . Replay entry: http://127.0.0.1:5173/?intro=1 .
