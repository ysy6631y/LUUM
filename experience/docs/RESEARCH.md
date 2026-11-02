# 레퍼런스 확인과 구현 — 2026-11-03 KST

## 실제 접근 결과

- https://www.cartier.com/en-fr/lechoeurdespierres : HTTP 요청 및 실제 Chromium 탐색 모두 403 Access Denied. `qa/cartier-access.png`.
- https://www.makemepulse.com/case-study/cartier-le-choeur-des-pierres : 본문과 공개 스크린샷 확인.
- 케이스 스터디에 연결된 landing / journey / desktop scroll / mobile 영상 CDN은 현재 403. 기존 저장소의 과거 시연 영상 연구 메모는 참고 기록이며, 이번 세션에서 영상 재생을 검증했다고 주장하지 않는다.
- 확인한 제작사 이미지: `d9lqg0iPhDVuXLKE_1-cover-image.png`, `spXTfrYrwQLVY6gd_4_cartier_full_desktop.jpg`, `Hcf5KEf9qUv63_o-_11_cartier_grid_4_desktop.jpg`, `A7EG-l5Fn_m2aHYt_12_grid.jpg` (images.prismic.io/makemepulse/).
- 다운로드한 레퍼런스는 작업용 `/tmp/luum-reference`에만 보관. Cartier 로고·보석·이미지·영상은 앱과 배포에 사용하지 않는다.

## 관찰한 것과 적용

| 확인된 원본 구성 | LUUM 구현 |
| --- | --- |
| 밝은 패브릭 위 중앙에 다섯 보석을 가로로 배치 | 실제 5개 GLB를 가로로 배치하는 컬렉션 화면 |
| 작은 상단 중앙 로고, 모서리 제어, 작은 닫기 버튼 | 중앙 LUUM, 좌측 컬렉션, 컬렉션 닫기 |
| 단일 제품이 화면의 중심을 차지하고 이름/스크롤 안내를 중앙 하단 표시 | 큰 실제 오브제, 하단 커스텀 폰트 제품명, 작은 스크롤 안내 |
| 선택한 보석에 따른 세계/배경 전환 | LUUM 원본 색상에 대응하는 스톤·브라운 배경과 조명 |
| 디테일과 문장을 비대칭으로 배치하며 여백 유지 | 오른쪽 패턴 확대/왼쪽 설명, 왼쪽 링 확대/오른쪽 설명 |
| 모바일 레퍼런스의 세로 이미지와 설명 흐름 | 제품·디테일을 위쪽, 본문을 아래쪽에 배치 |
| 손그림을 드러내는 레이어 (제작사 본문) | 손그림 에셋이 없으므로 그림을 만들어내지 않음. 실제 제품의 금색 패턴/링을 확대 |

## 검증되지 않은 원본 동작

원본의 정확한 로더 시퀀스, 카메라 좌표, 마우스 회전 범위, 스크롤 길이, easing, duration, 모바일 선택 제스처는 확인하지 못했다. 이 값들을 원본에서 추출했다고 주장하지 않는다.

아래는 요청된 LUUM 3D 탐색을 위한 구현 수치다.

- 시야각 30°, 기본 카메라 z=10.5, 제품 원형 크기 비율 유지
- 제품 교체: outgoing 0.65초, incoming 1.25초 / power2.inOut
- 컬렉션 펼치기: 1.2초 / power3.inOut
- 배경 전환: 1.4초 / power2.inOut
- 스크롤 전체 길이: 430svh, 4개 연속 포즈, smoothstep 보간과 지수 감쇠
- 본문 스크롤 레이어: GSAP ScrollTrigger scrub 0.7초
- 시스템 reduced-motion 또는 모션 줄이기: 선택/보간 최소화, 드래그 수동 탐색 유지

최우선으로 지킨 것은 원본 LUUM 5종의 형태·패턴·색과, 레퍼런스의 여백·중심 오브제·절제된 인터페이스다. 직접 확인이 불가능한 동작까지 1:1 재현되었다고 보장하지 않는다.
