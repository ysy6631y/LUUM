# LUUM — Beyond the visible

기존 React / Vite / Three.js 프로젝트를 유지한 인터랙티브 브랜드 경험입니다. 로컬에서 실행하거나 기존 GitHub Pages 워크플로로 배포합니다.

## 실행

```sh
npm ci
npm run dev
```

http://127.0.0.1:5173/

```sh
npm test
npm run test:browser
npm run build
node qa/verify-production.mjs
```

Vite `base: './'`. `/LUUM/` 하위 경로 검증 도구는 `dist`를 로컬에서만 임시 제공하며 외부에 업로드하지 않습니다.

## 현재 흐름

실제 에셋 로딩 → LUUM 오프닝 → 짧은 브랜드 스토리 → 기존 인터랙티브 3D 뷰어 → 5종 패턴·향·설명 비교 → 절제된 엔딩.

사용자 후속 지시에 따라 거대한 Glass 패널과 문장마다 한 화면씩 전환하는 텍스트 히어로를 제거했습니다. 일곱 문장은 작은 편집형 구성에서 함께 읽습니다. Glass 카드·버튼 추가도 최신 사용자 요청에 따라 모두 취소했습니다.

- 원본 GLB 5종, 스톤 색/노멀, 금색 패턴과 링, 음각 로고 유지
- 첫 제품 크기 유지, 불투명 재질의 공간 이동 전환
- 드래그 회전 우선: 누르는 동안 스크롤 카메라 정지, 놓으면 부드럽게 복귀
- 뷰어 포커스 + 좌우 방향키 회전, 버튼과 키보드로 디테일 탐색
- 스크롤: 전체 → 금색 패턴 → 상단 링 → 로고 → 실제 5종 컬렉션
- 물결·굴절 배경 셰이더 제거, 정적인 원본 패브릭과 제품별 웜 뉴트럴 배경
- 기존 PBR 조명과 원본 재질 유지, 새 배경 효과는 사용자 레퍼런스가 정해진 뒤 진행
- 실제 모델/폰트/이미지 준비 후 자동 프리로더 종료, 세션 내 재노출 없음
- 시스템 모션 감소, 모바일 반응형, WebGL 미지원 시 원본 모델 렌더 이미지 제공

## 제품 데이터

단일 원천 `src/content.js`. 자산 ID와 화면 배열 순서는 별개입니다. 실제 GLB 네이티브 메쉬와 렌더를 확인하고 연결했습니다.

| 제품명 | 원본 GLB | 패턴 | 향 |
|---|---|---|---|
| FOAM CLEANSER | 03 | Diamond Grid | 캐모마일 |
| SHAMPOO | 01 | Orthogonal Grid | 로즈마리 |
| CONDITIONER | 02 | Horizontal Lines | 라벤더 |
| BODY WASH | 04 | Chevron | 피오니 |
| BODY LOTION | 05 | Diagonal Lines | 캐모마일 |

BODY LOTION은 낮고 둥근 원본 용기입니다. 최신 사용자 매칭·향이 구 리플렛 메타데이터보다 우선합니다. 제품 설명은 원본 리플렛에서 각기 확인했고, 로션 설명은 클렌저에서 복제하지 않았습니다.

## 원본 보존

제공된 Blender와 폰트는 변경하지 않았습니다. `docs/asset-integrity.json`에 SHA-256과 글리프 범위가 있습니다. LUUM 폰트는 영문/숫자를 지원하며 한글은 Pretendard를 사용합니다. 모델은 원본 형태를 유지한 Meshopt GLB입니다. 절차형 재질의 색/노멀만 1024px로 베이킹했습니다.

`public/brand/luum-sheer.webp`는 사용자의 LUUM 원본 패브릭 이미지에서 만든 정적인 최적화 사본입니다. 구 영상은 현재 모델과 표기가 달라 소스에 보존하고 웹 경험에서는 제외했습니다. 레퍼런스 브랜드 에셋과 외부 물 효과 코드는 배포물에 포함하지 않습니다.

## 코드와 검증 기록

- `src/main.jsx`: 브랜드 흐름, 기존 뷰어 통합, ScrollTrigger와 접근성
- `src/scene.js`: 원본 모델, PBR 조명, 스크롤 카메라, 드래그 우선 처리
- `src/daylight.js`: 제품 표면에 투사하는 패브릭 광원 마스크
- `src/Pattern.jsx`: 원본 금색 패턴에 맞춘 비교용 도해
- `docs/ASSET_REVIEW.md`, `docs/RESEARCH.md`: 에셋과 실제 사례 조사
- `docs/QA.md`: 최종 실행 검증과 한계
- `qa/revised-*.png`, `qa/production-*.png`: 실제 브라우저 화면

작업 시작 전 체크포인트: `9d9dd93`. 현재 상태 스냅샷: `fe69585`. `main`에 푸시하면 기존 Actions가 https://ysy6631y.github.io/LUUM/ 에 배포합니다.
