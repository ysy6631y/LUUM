# 의존성과 에셋

Current release: the condensation texture and gray-green background color stay opaque and unchanged. Tracing darkens only the existing 1px geometric guide lines; it never reveals a sharp image or paints broad freehand strokes. The full-frame surface is static, with only the small guide region redrawn during input. Pattern view, reset and keyboard controls remain available.


정확한 버전은 package-lock.json에 고정되어 있습니다.

| 항목 | 출처 | 용도 / 라이선스 |
| --- | --- | --- |
| React / React DOM | https://github.com/facebook/react | UI / MIT |
| Vite | https://github.com/vitejs/vite | 빌드 / MIT |
| Three.js | https://github.com/mrdoob/three.js | WebGL, GLTFLoader, RoomEnvironment / MIT |
| meshoptimizer | https://github.com/zeux/meshoptimizer | Meshopt 인코딩·디코딩 / MIT |
| glTF Transform | https://gltf-transform.dev/ | 원본 GLB의 압축, 개발 도구 / MIT |
| GSAP / ScrollTrigger | https://gsap.com/standard-license/ | 전환·스크롤 / GSAP Standard License |
| Playwright | https://github.com/microsoft/playwright | 브라우저 검증 / Apache-2.0 |
| Inter | https://github.com/rsms/inter | UI 영문 폰트 / SIL OFL 1.1 |
| Pretendard v1.3.9 | https://github.com/orioncactus/pretendard | 본문·UI 한글 폰트 / SIL OFL 1.1 |
| LUUM_TEXTURE.blend, LUUM.woff2 | 사용자가 제공한 원본 | 브랜드 전용 에셋, 원본 보존 |
| luum-01~05.glb / PNG | 위 Blender 원본 | 제공 모델의 웹용 변환 및 대체 화면 렌더 |

## Current assets and visual treatments

Opening uses the user's `/Users/pc/Desktop/LUUM_WEB/references/assets/luum-openinig.mp4` (6s silent fabric film), converted to 720p MP4/WebM and a poster. Source video remains unchanged. Native video plays at 0.3× behind CSS background blur; there is no video-refraction shader or second product preview. Original entry phrases and header metrics come from the user's existing LUUM_WEB code.

`src/studio-backdrop.js` restores this project's own earlier product atmosphere: original procedural cloud texture, grain and slow light. The product light projection and geometric pattern SVGs are original project code. Small transparent buttons use native CSS backdrop filters; detail text and the delicate chapter rail have no glass surface. No third-party glass or water library is installed. The pattern atelier uses original Canvas 2D pointer drawing over the existing geometric SVG guides, showing one pattern per scroll passage. No external drawing package is used.

`public/brand/luum-sheer.webp` is a preserved optimized copy of `/Users/pc/Desktop/LUUM/image 1728.png`; it is not a second background in the current journey. Footer grain and pattern decoration are original procedural SVGs. Footer links were supplied by the user: GitHub Pages and Instagram @luum.

Cartier / Dior / La Prairie / makemepulse, Oimo Drops, Codrops demos, Cosmetics/BARRIER+, Random-eyes and Studio Mirage/Biotherm were visual research only. No campaign footage, brand logos, demo textures, shader source or sound from those references ships. The user's uploaded reference stills and screen recording are not included as public media. See `RESEARCH.md` and `ASSET_REVIEW.md` for inspection details.
