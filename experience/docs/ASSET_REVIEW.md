# LUUM source review — 2026-11-03

Checkpoint before this revision: `9d9dd93`.

## Matching verified before narrative implementation

`product-mapping-verified.json` records native GLB mesh names, categories and scents. Actual browser screenshots: `qa/mapping-*.png`. Canonical UI data lives only in `src/content.js`; asset IDs are independent from menu order.

| Category | Source asset | Native gold pattern | Scent per latest user brief |
|---|---|---|---|
| FOAM CLEANSER | 03 | diamond | Chamomile |
| SHAMPOO | 01 | grid | Rosemary |
| CONDITIONER | 02 | horizontal | Lavender |
| BODY WASH | 04 | zigzag | Peony |
| BODY LOTION | 05 | diagonal, low round vessel | Chamomile |

## Glass

No independent file named LUUM Glass was found. Existing `GlassCard` in `reference-luum-v1/components/LuumLanding.tsx` and its `.luum-glass` / `.glass-card` CSS were found, read, served locally and visually inspected. The older `/Users/pc/Desktop/LUUM_WEB/out` export shows the same design. Reused qualities: 10% white transmission, blur(8px) saturate(.98), 30px radius, opposing 145°/325° 1px reflection rims. The first large opening treatment was removed following explicit user feedback. The later request then cancelled Glass treatments entirely. No Glass panel, information card or Glass button remains in the current interface. Originals unchanged.

## Brand image and film

`/Users/pc/Desktop/LUUM/image 1728.png` (9772×6516) is the original sheer fabric image. Optimized a copy to 2400×1600 WebP at `public/brand/luum-sheer.webp`. It is now static and scoped individually to opening/story. All water/refraction background effects were removed by the latest user request. No stock or reference brand media shipped.

Existing `reference-luum-v1/public/assets/luum-product-reveal.mp4`: H264, 1920×1080, 24fps, 8sec. Visually inspected frames at 0,2,5sec. Starts with fabric, then a tall horizontal-line bottle marked BODY LOTION. That differs from the latest correct five-model specification, so this video is preserved but not presented as the current collection.

## Original brand guide

Read and rendered PDF-compatible originals through temporary copies, never overwrote Illustrator files:
- `/Users/pc/Desktop/LUUM/luum_logo,pattern.ai` — pattern explorations, logo construction and type rhythm.
- `/Users/pc/Desktop/LUUM/LUUM_editorial/리플렛_0608완성본수정.ai` — brand philosophy, pattern guide, five distinct descriptions.

The older leaflet's category/pattern and scent assignments differ from the latest user brief. Latest user instructions take precedence. Descriptions are distinct source statements: cleanser: 거품, 모공, 딥 클렌징; shampoo: 두피까지 내려가는 세정; conditioner: 머릿결 정돈 및 단백질 코팅; body wash: 미끄러지는 부드러운 결; lotion: 몸 전체에 고르게 퍼지는 텍스처. Lotion description was verified independently, so no duplicate cleanser text or unresolved placeholder remains.

Collection diagrams are explanatory vectors traced in code to match the verified original patterns' orientation and proportions: elongated diamond lattice, orthogonal grid, horizontal parallels, repeated chevrons, rising diagonal parallels. Original 3D meshes and source renders remain authoritative and unaltered.

## Font

Existing LUUM font preserves original bytes. It covers Basic Latin letters and digits, not Hangul. Brand wordmarks, Latin headings, product names and Latin parts of story/ending use LUUM. Korean falls back to supplied Pretendard. No synthetic stretching or remodelling.


## Current opening film and restored product composition

Found and visually inspected the actual earlier website opening `/Users/pc/Desktop/LUUM_WEB/references/assets/luum-openinig.mp4`: 6 seconds, 1920×1080, silent translucent fabric with no product labels or logo. This is distinct from the unused 8-second product reveal above. Source is preserved. Derived 1280×720 MP4 and WebM are served from `public/brand/luum-opening-720.*`; poster is extracted from the original first frame. No third-party footage is used. Initial screen shows the film, one small header wordmark and an English scroll cue. A single rounded translucent surface and Latin LUUM-font phrase appear only after scrolling. No large opening/ending LUUM logo repetition, visible Korean opening copy, header side links or tactile-experience footer label.

The product layout, palette, lights and camera return to deployed commit `bd27ef0`. Kept the subtle high-contrast cursor and original-size correction: tall vessels are 0.1900m high, BODY LOTION 0.0778m (40.95%). Read-only Blender measurements are in `model-dimensions.json`. Original metre scale is shared by every GLB; per-jar enlargement is removed, and native lower bounds determine hero/lineup grounding. Fallback posters compensate the original .26/.135 orthographic camera scales. No source BLEND, font, GLB or product texture is modified.
