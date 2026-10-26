# LUUM interactive experience

React + Vite + GSAP ScrollTrigger로 만든 **로컬 개발용** 브랜드 사이트. 공개 Coming Soon 페이지를 대체하지 않는다.

## 실행

Node.js 20.19+ 또는 22.12+.

```sh
cd experience
npm ci
npm run dev
```

http://127.0.0.1:5173/ 에서 확인. 루트 저장소에서 `cd experience`를 실행한다.

```sh
npm run build
npm run preview
npm test
npx playwright test
```

브라우저 검증은 `npx playwright install chromium`이 필요하다. 2560×1440(iMac 큰 창), 1920×1080, 390×844를 테스트한다. 해상도는 물리 디스플레이 인치 수가 아닌 **CSS 브라우저 viewport** 기준이다. OS 확대율과 창 크기에 따라 실제 레이아웃은 달라진다.

## 원본과 배포 보호

- 저장소 루트 `../index.html`은 기존 QR용 Coming Soon 그대로 보존.
- 작업 브랜치: `development/interactive-brand`.
- push, GitHub Pages 설정 변경, 배포 workflow 생성, 배포 실행 없음.
- Vite `base: './'`. `dist/`는 독립 정적 빌드이며 하위 경로에서도 에셋을 상대 참조.
- 루트 `index.html` 위에 dist 내용을 덮어쓰지 말 것. 실제 배포 경로/전략은 후속 단계에서 결정.

## 콘텐츠 교체

`src/content.js`가 미디어와 카피의 단일 진입점이다.

- `opening.poster`, `opening.video`, `opening.videoWebm`: `public/` 기준 경로. 현재 영상은 LUUM-V1의 기존 영상을 프리뷰로 사용. 영상 교체 시 MP4와 WebM 경로를 함께 바꾸거나 `videoWebm`을 빈 문자열로 비운다. `video: ''`로 두면 정적 영상 플레이스홀더로 동작.
- 영상은 자동재생하지 않음. 사용자가 Play film을 누를 때만 재생. 화면 이탈·탭 비활성·모션 감소 설정 전환 시 정지.
- `story.image`, `values.image`: 무드 이미지. 현재 기존 브랜드 영상에서 추출한 정지 프레임.
- `products`: 정확히 5개. id·title·line·description·color·ink·image·layout 교체.
- 투명 PNG/WebP 또는 SVG를 제품 이미지로 권장. 현재 SVG는 실제 제품/포장 디자인이 아닌 명시적 플레이스홀더.
- 교체 이미지에 오류가 나면 대체 영역을 표시하며 스크롤 무대는 유지됨.
- 원본 고해상도 이미지는 적절히 리사이즈하고 긴 설명은 모바일에서 다시 검증할 것.

## 인터랙션 구조

- `src/useExperience.js`: GSAP 수명주기, 미디어쿼리, 섹션 타임라인.
- `src/motionSpec.js`: 제품 타임라인의 시간 비율, 스크롤 거리, 보간 설정.
- `src/styles.css`: 편집 구도와 반응형 크기.
- 제품 5개는 하나의 pinned stage. 이미지 변형 → 설명 순차 등장 → 읽기 구간 → 다음 장면 순서.
- 데스크톱 제품 구간 스크롤 거리: viewport 높이 × 5 × 1.35. 모바일은 × 1.05.
- 타임라인은 스크롤에 종속되어 빠른/역방향 이동을 되돌릴 수 있음.
- 제품 숫자는 드래그 캐러셀이 아니라 해당 스크롤 위치로 이동하는 접근 가능한 바로가기 버튼.
- `prefers-reduced-motion: reduce` 또는 ‘모든 제품 펼쳐보기’에서는 pin/스크롤 모션을 제거하고 다섯 제품을 문서 순서대로 표시.

## 한계

실제 제품 사진·확정 카피가 없으므로 가상 제품명과 제안용 브랜드 문구를 사용한다. 3D/360°, 쇼핑·회원·문의 백엔드는 포함하지 않는다. Cartier 원본은 403으로 접근할 수 없어 제작사의 공개 시연 영상으로 검증 가능한 구도만 연구했다. 원본의 easing·pin 거리·모든 기기별 동작을 동일하게 복제했다고 주장하지 않는다.

- [조사 근거](docs/RESEARCH.md)
- [출처·라이선스](docs/THIRD_PARTY.md)
- [검증 결과](docs/QA.md)

## macOS 빠른 실행과 테스트 브라우저

Finder에서 `Start LUUM.command`를 더블클릭하면 서버와 브라우저가 열린다. 개발 서버는 `Ctrl+C`로 종료한다.

현재 환경(macOS 13)은 최신 Playwright 관리 브라우저 지원 대상이 아니므로 Chromium 134를 별도로 설치해 검증했다. 프로젝트의 Playwright 의존성은 최신 버전을 유지하고, `playwright.config.js`에서 사용 가능한 Chromium 실행 파일을 선택한다. 다른 설치 위치는 `CHROMIUM_EXECUTABLE` 환경변수로 지정할 수 있다. 일반적인 최신 macOS에서는 `npx playwright install chromium` 사용.

macOS 13에서 동일한 검증 브라우저 준비:

```sh
PLAYWRIGHT_SKIP_BROWSER_GC=1 npx --yes playwright@1.51.1 install chromium
npm run test:browser
```

스크롤 녹화: `qa/luum-scroll-demo.webm`. 큰 화면과 모바일 스크린샷은 `qa/`에 보관. 녹화 보조 스크립트는 `qa/record.mjs`이며 macOS 13에서는 호환되는 Playwright 드라이버의 모듈 경로를 `PLAYWRIGHT_MODULE`로 전달해야 한다.
