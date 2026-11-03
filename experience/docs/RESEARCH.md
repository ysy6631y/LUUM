# Latest refinements — user feedback verified against local source

Latest 20:31 screenshot feedback supersedes the temporary glass detail cards and simultaneous five-pattern slider. Detail text has no glass surface; the chapter rail is reduced to a thin low-opacity line/dots. Glass treatment remains on actual buttons. A 700svh (mobile 800svh) drawing atelier follows the product stage with a broad color/light transition. Only one original pattern is foregrounded at a time. The user can actually draw freehand gold strokes over its faint guide; each drawing persists across pattern changes. Guide/restart controls and direct 3D inspection remain available. This is original Canvas 2D implementation, not a copied reference effect.

Product switch correction: the outgoing object's rendered transform is captured and retained during its exit, preventing the old close-up from snapping into the incoming hero pose. The follow-up removes the added 2.2-second camera hold and 0.2-second entrance delay after the user reported odd motion. The hold was measured in clamped render time and could last longer under slow rendering. Camera progress now responds directly to scroll with existing damping; whole-object entrances are governed by the scroll chapter, and switches take 1.7 seconds. All original surfaces stay opaque. The chapter rail has only 2px dots and a 1px active line, with no connecting track.

The latest direction removes the opening center logo, all video distortion, large story typography and rectangular product overlays. Film is original 720p footage at 0.3×. A true CSS Background Blur (24px Gaussian backdrop filter) and a feathered mask uncover it; no video sampling shader remains. Small centered story text begins as that mask opens. Scroll progress controls text without delayed scrub; the last line completes early enough for a reading hold before departure. The old studio atmosphere is restored only inside the 3D product chapter.

Existing original website source inspected: `/Users/pc/Desktop/LUUM_WEB/components/LuumLanding.tsx`, `styles/globals.css`, `lib/motionSpec.ts`. Restored exact entry copy: “A small light opens the room.” / “Begin your routine with LUUM.” / “ENTER THE ROOM”. Source timeline is 0.9s / 1.45s line starts, 4.05–5.15s copy fade and 5.65–6.35s entry-button reveal. Asset progress remains real; returning sessions skip the gate. `?intro=1` explicitly previews it again.

Latest screenshot clarification: this copy appears over the same soft-blurred fabric film with the original header still visible, rather than on the source site's separate black background. The transparent gate only locks interaction; it adds no second background. The slow native video already plays underneath. Enter removes only the foreground words, unlocks scroll, and focuses the scroll cue. Reduced-motion visitors receive static copy and a separate entry button without a timed animation.

Header source: 1920px composition, 24px outside inset, 220px navigation inset, 120px link gaps, 23px LUUM wordmark and 12px UI; Home / Ritual / Texture / Product / Contact, Login and two-line menu. At 1440px the visual scale is 0.75: 18px outer inset, 90px gaps, 17.25px wordmark, 9px navigation. The original demo's gate failed to resolve in the research browser, so its CSS header surface was temporarily revealed for geometry inspection without changing the original source. Its letterboxed vertical offset is excluded from the current full-bleed film layout. Existing Login was a placeholder; no account backend is invented.

---

# Current direction — final user-defined structure

Latest instruction supersedes the product-first drafts documented below. Sequence: entry frost lifts to reveal the original slow film → brand story with varied text motion → one central product experience containing five individually staged product chapters → pattern comparison → brand information. No product preview in opening/story/footer. Preserve original GLB geometry, correct product mapping and the preferred five-pattern collection.

The user's attached stills informed thin capsule buttons, translucent planes, fine borders and editorial information density. The provided screen recording `/Users/pc/Desktop/화면 기록 2026-11-03 오후 7.13.22.mov` was inspected through 18 timed frames over its 11.55-second duration. Verified: a persistent central object while a foreground information plane scrolls away, followed by the next content plane rising into view (around 4.7–6 seconds). Applied continuity and foreground-layer principles, without copying the agency content, object or code.

Opening blur is an optical treatment over the user's own film, cleared upward by scroll; film playback is 0.45×. Each real product then has its own whole-object entrance before detail cameras. The earlier split product/story preview was removed in response to the final structure. Footer links are user-supplied: https://ysy6631y.github.io/LUUM/ and https://www.instagram.com/luum/ . No invented contact details.

---

# Historical research and superseded drafts

# Previous delivery direction (historical)

The latest user instruction is to deliver the earlier minimal version with the water effect removed, cancel all newly added Glass cards/buttons, and preserve the product interaction plus the “손끝으로 읽는 다섯 가지 차이” collection. Implemented. Section backgrounds are opaque and the 3D canvas is contained inside its product section to prevent cross-section bleed. This historical override was superseded by the film and Studio Mirage revision below.

The supplied [Oimo Drops](https://oimo.io/works/drops/) demo was opened in Chromium, visually inspected, and dragged. It presents deforming refractive fluid with adjustable surface tension, gravity and caustics. A future isolated interlude is technically feasible, but it is deliberately not inserted into the requested water-free version. No demo code/environment imagery copied. Its linked repository was identified as https://github.com/saharan/works/tree/main/drops; license must be checked before source reuse.

Studio Lumio's real opening was also inspected as an opening reference before the latest cancellation. No Lumio identity, code or media is used.

---

# LUUM art direction and source research — 2026-11-03

Latest steering takes precedence: remove the oversized Glass panel and sequential full-screen text heroes. The seven exact brand sentences remain together in a compact editorial composition. Opening uses the original sheer fabric atmosphere and a restrained LUUM mark. Product hero size remains unchanged.

## Primary brand references actually inspected

All three makemepulse case-study texts were opened and public images downloaded into `/tmp/luum-brand-reference` for visual contact-sheet comparison. Reference brand images, film, logos and code are not included in this application.

- [Cartier — Le Chœur des Pierres](https://www.makemepulse.com/case-study/cartier-le-choeur-des-pierres): isolated objects in luminous space, extremely restrained interface, layered scenes and drawing/object transitions. Actual Cartier campaign URL still returns 403; no claims about unverified live camera timing. Apply object-first composition and coherent lighting, not gemstone/brand assets.
- [Dior — Rouge Dior](https://www.makemepulse.com/case-study/christian-dior-parfums-rouge-dior): public frames show interleaved campaign media and a dominant 3D lipstick; device compositions retain focused product hierarchy. Apply a continuous optical atmosphere into the existing GLB canvas. Do not force mismatched old LUUM product video into this collection.
- [La Prairie — The Pursuit of Harmony](https://www.makemepulse.com/case-study/la-prairie-the-pursuit-of-harmony): public screens show immersive spatial artwork/exhibition, light, stillness and physical forms. Apply spatial pattern/light language; do not copy blue architecture or assets.

Visual contact sheets inspected: `cartier-sheet.jpg`, `dior-sheet.jpg`, `prairie-sheet.jpg` under temporary research directory. These are reference-only, not distribution assets.

## Public WebGL implementation references

- [Three.js official physical transmission example](https://threejs.org/examples/webgl_materials_physical_transmission.html), [GitHub source](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_physical_transmission.html). Opened in Chromium and actual rendered result inspected (`transmission-live.png`). Shows refraction sampling the surrounding environment. Three.js is MIT. No external environment map or demo model reused; project keeps its existing RoomEnvironment and original model PBR materials.
- [liquidglass repository](https://github.com/ybouane/liquidglass) inspected as an alternative. Its demo URL returned a host error; visual result could not be verified, so no library or code adopted.

## User-supplied Codrops water collection

[Codrops water tag](https://tympanus.net/codrops/hub/tag/water/) opened; followed actual demo links.

- [Clearwater](https://aureliengmz.github.io/clearwater/): successfully rendered in Chromium. Screenshot inspected: small moving surface waves focus sunlight into connected caustic filaments. Useful principle: light concentration and soft distortion. No water scene, textures or source code copied. Ocean palette/specular glare are unsuitable for LUUM's neutral product background.
- [Lightweight Water Distortion](https://codepen.io/ksenia-k/full/RwXVMMY): Cloudflare human-check blocked the actual demo. Not treated as visually verified.
- [Heat Distortion / Water](https://tympanus.net/Tutorials/HeatDistortionEffect/index4.html): human-check blocked browser rendering. Not treated as visually verified.

The earlier experimental atmospheric shader has now been removed. The projected product light mask is original LUUM code. No new external VFX assets or unverified licenses are introduced.

## Original LUUM assets

See `ASSET_REVIEW.md` for the original GlassCard, Illustrator guide, leaflet, video, font coverage and correct GLB category/pattern mapping. User's latest mapping overrides older source leaflet metadata. Original files remain unchanged.


## Cosmetics/BARRIER+ follow-up reference

Reference: https://cosmetics-web-nu.vercel.app/ . Inspected the actual Chromium-rendered page and scrolling screenshots. Verified the large rounded top of the dark lower section rising into view, section depth and restrained transition from a pale background. The initial WebGL hero did not render in this research browser; no unverified hero interaction is claimed. Initially applied a rounded-layer transition over the original opening film; the user subsequently rejected the detached card and this treatment has been removed. Header and bottom product-selection strips use restrained translucent separation. Reference media, product designs, text and code are not included.

Latest direction preserves the deployed product composition and the original five-pattern collection. Removes the experimental circular product menu, original-color shader and sound. Opening uses the found 6-second original LUUM fabric film; only the scrolling overlay is new. The seven supplied story sentences stay together in the existing compact editorial section.


## Current revision — Studio Mirage / Biotherm

Reference: https://studiomirage.io/works/biotherm . Opened the actual case-study page in Chromium and visually inspected top and scrolled screenshots (1440×1000). The case-study itself shows a continuous animated reflective, vertically distorted background, foreground editorial content, and text defocusing as it passes behind the fixed header. The linked campaign is not claimed as inspected.

Applied principles: one continuous source background across opening and story, broad optical folds responsive to pointer position, a soft masked header blur, and an asymmetric editorial layout with actual LUUM brand content. Removed the detached rounded glass card, repeated fabric still and repeated five-pattern band. Kept the real product viewer and five-pattern collection. Native WebGL shader is original project code sampling only the user's film; no Mirage imagery, video, logos or source code copied. Colors remain LUUM warm neutrals. The optical treatment is shallow refraction, not a recreation of the reference's reflective 3D cylinders.
