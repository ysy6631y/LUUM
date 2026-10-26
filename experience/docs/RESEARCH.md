# 레퍼런스 조사 — 2026-10-27

## 확인 범위

- 메인: https://www.cartier.com/en-fr/lechoeurdespierres
- 원본 HTTP 요청은 403. 초기에 연결 브라우저가 없었고, 이후 사용자 요청으로 설치한 Chromium에서도 403을 확인했다. 원본 페이지 전체를 직접 조작했다고 주장하지 않는다.
- 대체 1차 자료: 제작사 https://www.makemepulse.com/case-study/cartier-le-choeur-des-pierres
- 제작사 공개 영상의 프레임을 내려받아 실제로 검토했다. Cartier 영상·이미지는 LUUM 사이트에 포함하지 않았다.
  - 데스크톱: https://makemepulse.cdn.prismic.io/makemepulse/_i1JSEEv-z2B2D4i_10_cartier_case_video_scroll.mp4.mp4
  - 모바일: https://makemepulse.cdn.prismic.io/makemepulse/mMNczmBhSzbkjCVH_7_cartier_case_video_mobile_full.mp4.mp4

## 관찰과 적용을 구분

| 공개 영상에서 확인한 구성 | LUUM 적용 |
|---|---|
| 데스크톱 0–2초: 큰 제품이 위로 이동하고 중앙 설명이 나타남 | 제품 이미지와 설명을 다른 타이밍에 배치 |
| 4–6초: 작은 디테일 이미지가 대형 이미지로 확장 | 이미지 클립 영역 확장과 완만한 스케일 변화 |
| 8초: 왼쪽 작은 문장, 오른쪽 큰 이미지 | Story 비대칭 편집 구도 |
| 10–12초: 녹색 전체 장면으로 넘어가며 서로 다른 크기의 이미지 | 제품마다 컬러·배치가 바뀌는 연속 무대 |
| 모바일 시연: 보석의 세로 중심 배치 | 모바일 제품을 이미지 위·설명 아래로 재구성 |

위 시간은 **시연 영상 내 시간**이며 원본 스크롤 위치·duration·easing 값이 아니다. 정확한 pin 거리, 원본 easing, 모바일 상세 전환은 검증하지 못했다. LUUM의 수치는 독립 설계다. 브랜드 에셋 복제, Cartier 동작의 1:1 재현을 하지 않았다.

## 구현 연구

- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
  - pin, scrub, invalidateOnRefresh, 함수형 end. React cleanup은 matchMedia의 revert로 처리.
- GSAP matchMedia: https://gsap.com/docs/v3/GSAP/gsap.matchMedia/
  - breakpoint 변경 및 reduced motion에 따른 타임라인 복구.
- Codrops OnScrollLayoutFormations: https://github.com/codrops/OnScrollLayoutFormations
  - 문서: https://tympanus.net/codrops/2024/09/18/exploration-of-on-scroll-layout-formations/
  - js/index.js를 검토. pin + 단일 scrub timeline + 텍스트의 시간차 패턴 참고. 코드·이미지는 복사하지 않음. 저장소 MIT.
- Lenis: https://github.com/darkroomengineering/lenis — MIT. 검토 후 제외. 기본 스크롤을 유지하고 scrub으로 필요한 보간만 수행.
- Motion: https://motion.dev/ — 검토 후 제외. 스크롤 엔진 중복을 피함.
- Anthropic frontend-design: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- Vercel React best practices: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
- Vercel web design guidelines: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
  - 세 스킬을 공식 Git 저장소에서 설치하고 읽음. transient scroll 값으로 React rerender를 유발하지 않으며 semantic links/buttons, reduced motion, visible focus, media 크기 지정 적용.

## 시각 체계와 자체 검토

- 기존 Coming Soon의 paper #f6f4ef / ink #343a35를 유지. 추가 색은 제품 장면의 sage #d4d9d3, stone #e4ded6, dusk #5c675f, linen #dad4c9.
- 기존 LUUM.woff2는 로고에만 사용. 편집 헤드라인은 시스템 Georgia, 한국어 본문은 시스템 산세리프. 원격 폰트 요청 없음.
- 구도: 전면 브랜드 필름 → 비대칭 Story → 중앙 쉼 → 제품 연속 무대 → 대형 Values 이미지 → 조용한 대형 로고.
- 카드 반복, 임의 배지, 마우스 추적, 커서 교체, 자동 스크롤 강제 없음.
- 제품 SVG의 명암은 가상 용기의 재질 표현용이며 섹션 배경은 단색.
- 제품명·설명·가치는 제안용 문구다. 제품 사양·효능·성분·인증을 주장하지 않는다.
- 첨부 콘텐츠 이미지는 이 세션에 제공되지 않아 요청문에 적힌 5개 섹션 순서를 사용했다.
