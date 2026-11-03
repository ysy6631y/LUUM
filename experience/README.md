# LUUM — Beyond the visible

Current release: the condensation texture and gray-green background color stay opaque and unchanged. Tracing darkens only the existing 1px geometric guide lines; it never reveals a sharp image or paints broad freehand strokes. The full-frame surface is static, with only the small guide region redrawn during input. Pattern view, reset and keyboard controls remain available.


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

같은 흐릿한 영상과 헤더 위에 기존 영문 진입 문구 / ENTER THE ROOM → 스크롤로 부드러운 블러를 걷어내는 오프닝 영상 → 작은 중앙 정렬 브랜드 스토리 → 한곳에 모인 5종 제품 탐색 → 패턴 비교 → 브랜드 정보와 링크.

별도 검은 진입 화면을 만들지 않습니다. 원본의 두 영문 문장이 작게 차례로 등장한 뒤 ENTER THE ROOM으로 이어집니다. 실제 필수 에셋이 준비되어야 진입할 수 있으며, 클릭하면 문구만 사라지고 동일한 영상·블러·헤더가 유지됩니다. 방문 세션에서는 반복하지 않으며, http://127.0.0.1:5173/?intro=1 로 처음 경험을 다시 볼 수 있습니다.

제품은 중앙의 탐색 구간에서만 강조합니다. 앞쪽 제품 미리보기는 제거했습니다. 기존 6초 패브릭 영상은 0.3배속으로 사용하며, 오프닝과 스토리는 하나의 영상 배경을 공유합니다. 영상이 두 장으로 갈라지는 경계나 분리된 빈 카드가 없습니다.

- 최초 블러 면은 Figma Background Blur에 해당하는 CSS `backdrop-filter: blur(24px)`입니다. 부드러운 마스크가 스크롤로 위로 걷힙니다. 영상 왜곡 셰이더와 중앙 로고는 제거했습니다.
- 브랜드 스토리의 정확한 7개 문장은 14–17px 중앙 정렬로 등장합니다. 블러가 열리는 지점과 스토리 시작을 겹치고, 마지막 문장이 먼저 완성된 뒤 충분히 머무릅니다. 모션 감소 설정에서는 모두 바로 읽을 수 있습니다.
- 제품 탐색은 5개 스크롤 챕터입니다. 각 제품의 전체 등장 → 패턴 → 링 → 음각 로고 → 퇴장 순서를 거친 다음, 다음 제품이 전체 모습으로 새로 등장합니다.
- 다음 제품으로 넘어갈 때 이전 클로즈업 카메라를 이어받지 않습니다. 제품 메뉴로도 해당 제품의 전체 장면으로 이동할 수 있습니다.
- 마지막에는 원본 크기 비율의 5종 컬렉션을 함께 보여주고 패턴 정보로 연결합니다.
- 원본 GLB 5종, 스톤 색/노멀, 금색 패턴과 링, 음각 로고 유지. 긴 용기 19cm / BODY LOTION 7.78cm의 원본 비율과 바닥 정렬 유지.
- 불투명 공간 전환, 드래그 회전 우선, 키보드 회전과 장면 탐색 유지.
- 제품 전체를 덮던 네모 면은 제거하고 이전의 일렁이는 스튜디오 배경을 복원했습니다. 실제 제품 스톤 색상에 맞춰 배경이 변합니다. 버튼은 같은 투명 테두리와 7px 배경 블러로 통일했습니다. 최신 피드백에 따라 설명 카드와 우측 인디케이터의 유리 면은 제거하고, 인디케이터는 가는 선과 옅은 점으로 바꿨습니다. 전체 WebGL 화면을 블러하지 않습니다.
- 제품 전환 시 나가는 제품의 마지막 자세를 유지합니다. 각 제품의 전체 등장 구간은 스크롤로 제어합니다. 카메라를 2.2초 동안 강제로 멈추던 처리와 추가 등장 지연을 제거해 스크롤 방향·위치에 즉시 반응합니다. 하단 제품명은 화면 끝에서 30px 이상 떨어집니다.
- 패턴 구간은 데스크톱 700svh / 모바일 800svh의 긴 드로잉 아틀리에입니다. 다섯 가지 원본 그래픽을 한 번에 펼치지 않고 하나씩 부드럽게 교체합니다. 제품 이미지나 3D를 재전시하지 않습니다. 사용자가 마우스·터치로 실제 선을 그리며, 패턴별 그림은 이동 후에도 보존됩니다. 가이드 보기 / 다시 그리기 / 해당 3D 디테일로 돌아가기와 키보드 탐색을 제공합니다. 제품 섹션 경계는 색과 빛의 넓은 전이 면으로 연결합니다.
- 푸터는 작은 로고, 짧은 카피, 5종 컬렉션 링크, GitHub 웹사이트, Instagram @luum만 남긴 짧은 디렉터리입니다. 반복 브랜드 스토리와 큰 제목은 삭제했습니다. 확인되지 않은 주소나 사업자 정보는 만들지 않았습니다.
- 원본 헤더의 Home / Ritual / Texture / Product / Contact와 좌우 배치·간격을 복원했습니다. Login은 원본의 미구현 계정 항목으로 표시하며 별도 인증 기능을 만들지 않았습니다.
- 영상 0.3배속, 제품 전환 1.7초, 배경 색 전환 2.4초로 고요한 무드를 유지합니다. 카메라에 별도의 시간 대기를 걸지 않습니다.
- 영상 일시정지, 화면 밖 렌더 중단, 모바일 반응형, 모션 감소, WebGL 미지원 원본 이미지 대체 화면 제공.

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

`public/brand/luum-sheer.webp`는 사용자의 LUUM 원본 패브릭 이미지에서 만든 정적인 최적화 사본입니다. 제품 표기가 다른 8초 제품 영상은 사용하지 않습니다. 기존 웹사이트의 별도 6초 패브릭 영상 `luum-openinig.mp4`를 720p MP4/WebM으로 변환해 오프닝에서 사용합니다. 원본 영상은 보존했습니다. 레퍼런스 브랜드 에셋과 외부 물 효과 코드는 배포물에 포함하지 않습니다.

## 코드와 검증 기록

- `src/OpeningFilm.jsx`: 원본 영상의 자동재생·화면 밖 정지·모션 감소·재생 제어
- `src/PatternAtelier.jsx`: 패턴별 스크롤 장면과 이벤트 기반 2D 드로잉, 터치·그림 보존·초기화
- `src/studio-backdrop.js`: 복원된 제품 전용 스튜디오 배경, 스톤 팔레트와 느린 빛의 움직임
- `src/journey.js`: 5개 제품 챕터와 각 장면의 단일 진행도 매핑
- `docs/model-dimensions.json`: Blender 원본 읽기 전용 실측
- `src/main.jsx`: 브랜드 흐름, 기존 뷰어 통합, ScrollTrigger와 접근성
- `src/scene.js`: 원본 모델, PBR 조명, 스크롤 카메라, 드래그 우선 처리
- `src/daylight.js`: 제품 표면에 투사하는 패브릭 광원 마스크
- `src/Pattern.jsx`: 원본 금색 패턴에 맞춘 비교용 도해
- `docs/ASSET_REVIEW.md`, `docs/RESEARCH.md`: 에셋과 실제 사례 조사
- `docs/QA.md`: 최종 실행 검증과 한계
- `qa/revised-*.png`, `qa/production-*.png`: 실제 브라우저 화면

작업 시작 전 체크포인트: `9d9dd93`. 현재 상태 스냅샷: `fe69585`. `main`에 푸시하면 기존 Actions가 https://ysy6631y.github.io/LUUM/ 에 배포합니다.
