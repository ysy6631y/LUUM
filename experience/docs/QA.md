# 최종 검증 — 2026-11-03 KST

## 실행 환경과 결과

- 실제 개발 서버: Vite http://127.0.0.1:5173/, HTTP 200.
- 실제 Chromium 134에서 WebGL 렌더링과 UI 조작을 수행했다. 연결된 CUA 브라우저가 없어서 저장소의 Playwright/Chromium으로 확인했다.
- `npm test`: 2개 통과. GLB 5개 구조·실제 BODY/금색 링/패턴·텍스처·Meshopt와 폰트 SHA-256 검증.
- `npm run test:browser`: 3개 통과 (51.9초). 데스크톱 전체 제품, 전환, 4개 스크롤 장면, 실제 드래그 픽셀 변화, 컬렉션, 폰트, 모바일, reduced-motion, WebGL 불가 대체 화면.
- 모바일 구도 수정 후 `npm run test:browser -- --grep portrait`: 1개 재검증 통과.
- `npm run build`: 성공. Three.js 코어 약 583KB minified에 대한 크기 안내 경고가 남으며 빌드 오류는 없다. 코어는 약 145KB gzip, 별도 동적 씬 청크를 사용한다.
- 최종 정적 빌드 `/LUUM/` 하위 경로에서 직접 브라우저 검증: GLB 5개, 웹폰트 3개 모두 정상 응답, JS/HTTP 오류 0. PEARL 제품 선택 동작 확인.
- 화면 크기: 1440×1000, 390×844, 320×740. 가로 넘침 없음.
- 운영 의존성 `npm audit --omit=dev`: 취약점 0.

## 실제 확인한 에셋

| 원본 | 웹 화면에서 확인 |
| --- | --- |
| PRODUCT_01 | 진한 브라운, 격자 금색 패턴, 금색 상단 링, 하단 음각 |
| PRODUCT_02 | 웜브라운, 가로 금색 패턴, 원본 실루엣 |
| PRODUCT_03 | 밝은 브라운, 마름모 금색 패턴 |
| PRODUCT_04 | 아이보리, 지그재그 금색 패턴 |
| PRODUCT_05 | 낮고 둥근 밝은 용기, 사선 금색 패턴 |

5개 GLB 합계 약 13MB. 디코딩은 초기 제품을 먼저, 나머지를 순서대로 진행해 메모리 급증을 줄인다. DPR은 데스크톱 1.8, 모바일 1.5로 제한한다. 카메라·제품·조명이 정지한 뒤에는 같은 장면을 반복 렌더링하지 않는다. 비활성 탭에서는 렌더링하지 않는다.

## 수정한 문제

1. 원본 이방성 확장에 필요한 UV/탄젠트 부재로 금속이 검정/흰색으로 보임 → 복사 GLB의 이방성 확장 제거, 원본 금색 PBR 수치 유지.
2. 컬렉션 외곽 제품이 화면 밖으로 나감 → 화면 비율과 이름 버튼 위치에 맞춰 실제 카메라 투영 폭으로 배치 계산.
3. 모델 전환 직후 투명 모델 중첩 → weight와 depthWrite를 함께 제어.
4. 모바일 클로즈업과 헤드라인 중첩 → 모델은 위쪽 디테일, 문장은 아래쪽 배치.
5. 320px 화면에서 제품 하단과 이름이 겹침 → 모바일 카메라 포즈 크기·높이 조정.
6. 구 프로젝트의 영상/SVG·베이킹 중간 파일이 배포에 포함됨 → 소스는 보존하고 빌드 결과에서만 제외.

## 증거

`qa/final-product-01~05.png`, `qa/final-desktop-collection.png`, `qa/final-desktop-scene-1~3.png`, `qa/final-mobile.png`, `qa/final-mobile-detail.png`, `qa/final-mobile-collection.png`, `qa/final-pages-mobile.png`, `qa/final-webgl-fallback.png`.

원본 BLEND와 첨부/웹용 LUUM 폰트의 SHA-256을 재확인해 변경되지 않았음을 확인했다. `docs/asset-integrity.json`.

## 검증 한계

Cartier 본 사이트와 제작사 동영상은 403이어서 원본의 정확한 시간·이징·카메라 경로에 대한 1:1 비교는 불가능했다. 제작사 공개 스크린샷 및 설명을 기준으로 구도를 비교했다. 실제 iPhone/Android 하드웨어와 Safari에서는 실행하지 않았으며 모바일 검증은 Chromium의 뷰포트·입력·미디어 환경을 사용했다. GitHub Pages에 푸시/배포하지 않았고 동일한 하위 경로 구조를 로컬 정적 서버에서 확인했다.
