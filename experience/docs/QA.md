# 검증 결과 — 2026-10-27

## 환경

macOS 13 / Node 24 / Chromium 134 (Playwright로 실제 브라우저 실행).
사용자가 테스트용 브라우저 준비를 요청한 뒤 호환 Chromium을 설치했다. 최신 관리 브라우저는 macOS 13을 지원하지 않아, 호환 Chromium 실행 파일을 현재 Playwright 드라이버에 지정했다.

## 통과 항목

| 검증 | 결과 |
|---|---|
| `npm run build` | 성공. JS gzip 약 120 KB, CSS gzip 약 3.7 KB |
| `npm test` | 전환 인덱스/경계/역방향 2개 통과 |
| 2560×1440 | 제품 1–5, 5→3→1→5, 텍스트 경계, 가로 넘침, pin 해제 통과 |
| 1920×1080 | 동일 항목 통과 |
| 390×844 | 동일 항목 통과 |
| 375×667 | 동일 항목 통과 |
| 모션 감소 | pin 없음, 제품 5개 노출, 영상 정지, 이미지 decode 성공 |
| 모션 토글 및 breakpoint 변경 | pin 정리 후 재생성, 중복 pin 없음 |
| 키보드/미디어/오류 | skip-link 포커스, 영상 재생·정지, 이미지 오류 fallback 통과 |
| 콘솔 | 기본 4개 viewport 시나리오에서 console error / pageerror 없음 |
| 하위 경로 빌드 | `/LUUM/experience/` 실제 정적 서버에서 이미지·폰트·JS 로딩 및 제품 05 이동 성공 |
| QR용 Coming Soon | `git diff HEAD -- index.html` 변화 없음 |
| npm 의존성 | 최신 프로젝트 의존성 설치 후 audit 0 vulnerabilities |

브라우저 7개 시나리오 중 첫 6개 통과 후, 마지막 미디어 시나리오가 기존 MP4 호환성 문제와 재생 상태 경합을 발견했다. WebM 대체 소스와 실제 video 이벤트 기반 상태 동기화로 수정하고 해당 시나리오를 다시 실행해 통과했다. 변경 후 빌드와 단위 테스트도 통과했다.

## 스크린샷을 보고 수정한 내용

- iMac 크기에서 제품이 작아 보여 SVG viewBox를 정리하고 제품 비중 확대.
- 2000px 이상에서 본문과 탐색 텍스트 크기를 별도 보정.
- 중앙 제품 구도와 좌·우 구도를 분리.
- 낮은 모바일 화면에서 무대 높이·이미지·설명 간격 조정.
- 어두운 장면의 상단 글자색을 장면 색상에 동기화.
- 중복된 대형 배경 번호 제거.
- WebM 313 KB 대체 영상 추가. 자동재생 없이 사용자가 재생하며 화면/탭 이탈 시 정지.

## 증거 파일

- `qa/imac-opening.png`, `qa/imac-story.png`, `qa/imac-product-01~05.png`, `qa/imac-values.png`
- `qa/desktop-*.png`, `qa/mobile-*.png`, `qa/small-mobile-*.png`
- `qa/mobile-reduced-motion.png`
- `qa/luum-scroll-demo.webm`: wheel 스크롤 전체 흐름 및 제품 역순 탐색 녹화
- `qa/scroll-contact-sheet.jpg`: 녹화의 시간별 프레임. 빠른 테스트 스크롤이므로 방문자의 실제 감상 속도를 의미하지 않음.
- `qa/cartier-access.png`: Chromium에서도 원본 URL 403 확인

## 남은 확인 / 개선

- 실제 iMac의 디스플레이 확대율, Safari, 터치 기기 하드웨어에서는 아직 검증하지 않았다. 인치 수만으로 CSS viewport는 정해지지 않는다.
- Cartier 원본 전체 페이지의 직접 조작은 403으로 불가능. 공개 제작사 시연 영상의 검증 가능한 부분만 적용했다.
- 제품 사진·영상·최종 카피가 확정되면 구도, 이미지 크롭, 읽기 구간을 다시 조율해야 한다.
- 현재 Story/Values 이미지는 기존 LUUM 영상 파생본이다. 전용 고해상도 편집 이미지로 교체하면 질감과 장면 차이가 더 명확해진다.
- 3D, 360° 회전, 결제·회원·문의 서버는 이번 범위 밖이다.
