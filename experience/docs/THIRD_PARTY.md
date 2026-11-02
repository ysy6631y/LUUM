# 의존성과 에셋

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

기존 영상·SVG·이미지는 로컬 소스에 보존하되 현재 화면과 배포에는 사용하지 않습니다. Cartier / makemepulse 이미지는 레퍼런스 확인에만 사용했습니다.

## November brand journey revision

Original LUUM sheer image is a derived optimized copy from the user's local brand assets (`/Users/pc/Desktop/LUUM/image 1728.png`). Source files remain unchanged. Brand case-study media and Codrops demos were used for visual research only and are not shipped. The optical atmosphere and light mask are original project code; no third-party water effect library was installed. See `RESEARCH.md` and `ASSET_REVIEW.md`.

Latest delivery: removed the water/refraction background shader and cancelled all Glass treatments. Oimo Drops and Studio Lumio were inspected only; no assets, source code, environment or sound from those sites are included.
