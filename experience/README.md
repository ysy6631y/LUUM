# LUUM — The Shape of Stillness

기존 Vite / React 프로젝트를 실제 Three.js GLB 경험으로 교체했습니다. 원본 Blender 파일과 브랜드 폰트는 보존했습니다. `reference-luum-v1` Next.js 프로젝트는 변경하지 않았습니다.

## 실행

```sh
npm ci
npm run dev
```

브라우저: http://127.0.0.1:5173/
Mac에서는 기존 `Start LUUM.command`를 실행해도 됩니다.

```sh
npm test
npm run test:browser
npm run build
npm run preview
```

`dist/`는 정적 배포 결과입니다. Vite `base: './'`를 사용하므로 `/LUUM/` 같은 GitHub Pages 하위 경로와 일반 루트 호스팅에서 동작합니다. 기존 상위 저장소의 `.github/workflows/luum-pages.yml`을 유지했습니다.

## 경험

- 실제 5개 제품과 텍스처 로딩 → 입장
- 하단 제품 선택: 금색 패턴, 원본 색상·형태가 다른 GLB 사이의 깊이 전환
- 상단 컬렉션: 5개 실제 모델을 한 화면에서 선택
- 스크롤: 전체 오브제 → 금빛 패턴 확대 → 상단 링 → 리추얼
- 드래그: 제품 회전. 마우스 이동: 절제된 시점·조명 반응
- 우측 점: 장면 바로가기. 키보드 포커스·ESC 닫기 지원
- 모션 줄이기 버튼 및 시스템 reduced-motion 지원
- WebGL 불가·컨텍스트 소실·모델 로딩 실패: 원본 Blender로 렌더링한 제품 이미지 탐색

## 실제 에셋

`public/models/luum-01~05.glb`는 제공된 `LUUM_TEXTURE.blend`의 `PRODUCT_01~05` 컬렉션에서 직접 내보냈습니다. 각 GLB는 BODY, GOLD_RING, ENGRAVING을 유지합니다. 재모델링·대체 용기·지오메트리 단순화는 하지 않았습니다. 원본 절차형 스톤 셰이더는 1024px 색/노멀 텍스처로 베이킹했습니다. Meshopt 압축을 사용합니다. UV/탄젠트가 없는 금속에 GLB 이방성 확장을 적용했을 때 발생한 잘못된 반사는 내보낸 복사본에서 해당 확장만 제거해 해결했습니다. 금색 원본 base color, metallic, roughness는 유지했습니다.

`public/models/*.png`는 원본 모델의 Blender 렌더이며 선택기와 WebGL 대체 화면에 사용됩니다. 제품명 UMBER / SIENNA / SAND / IVORY / PEARL은 원본 번호에 대응하는 편집용 명칭입니다. 성분·효능·실제 상품명을 추정하지 않았습니다.

`public/media/LUUM.woff2`는 첨부 폰트와 SHA-256이 동일합니다. 영문 대·소문자, 숫자, 공백만 지원합니다. 실제 @font-face와 unicode-range로 로고·메인 헤드라인·제품명에 적용하며, UI는 Inter / Pretendard입니다.

## 주요 파일

- `src/scene.js`: GLB, 조명, 카메라, 모델 전환, 드래그, 렌더링 제어
- `src/main.jsx`: 로딩, 제품·컬렉션 선택, 스크롤 레이어, 접근성
- `src/content.js`: 제품 설명과 편집용 이름
- `src/styles.css`: 브랜드 폰트와 데스크톱·모바일 구성
- `tools/export_models.py`: 원본을 읽기만 하는 베이킹/GLB 변환
- `tools/render_posters.py`: 원본 제품의 투명 PNG 렌더링
- `docs/RESEARCH.md`: 레퍼런스 증거·구현 범위·차이
- `docs/QA.md`: 실제 검증 결과

원본 경로는 변환 도구 상단 `ROOT`에 설정되어 있습니다. 두 스크립트는 `.blend`를 저장하거나 덮어쓰지 않습니다. 구 프로젝트의 영상·SVG는 소스에 보존하되 최종 배포에서는 제외합니다.
