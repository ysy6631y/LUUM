export const asset = path => `${import.meta.env.BASE_URL}${path}`;

// Verified against the actual exported GLB geometry and original product renders.
// id is the source asset ID, NOT the collection position. Product 03 has diamonds;
// 01 has an orthogonal grid; 02 horizontal lines; 04 chevrons; 05 diagonal lines.
export const products = [
  { id:'03', studioBg:'#cebeb2', studioInk:'#3d342d', number:'01', name:'FOAM CLEANSER', ko:'폼 클렌저', patternKey:'diamond', patternName:'Diamond Grid', patternKo:'다이아몬드 교차 격자', scent:'Chamomile', scentKo:'캐모마일', vessel:'tall', bg:'#e8dcd0', ink:'#4b3b31', tone:'캐모마일 · Chamomile', description:'거품, 모공, 딥 클렌징.', descriptionStatus:'source-confirmed' },
  { id:'01', studioBg:'#8a7d73', studioInk:'#fffdf8', number:'02', name:'SHAMPOO', ko:'샴푸', patternKey:'orthogonal', patternName:'Orthogonal Grid', patternKo:'수직·수평 그리드', scent:'Rosemary', scentKo:'로즈마리', vessel:'tall', bg:'#d6cec2', ink:'#393029', tone:'로즈마리 · Rosemary', description:'두피까지 내려가는 세정.', descriptionStatus:'source-confirmed' },
  { id:'02', studioBg:'#b19d8e', studioInk:'#332b25', number:'03', name:'CONDITIONER', ko:'컨디셔너', patternKey:'horizontal', patternName:'Horizontal Lines', patternKo:'가로 평행선', scent:'Lavender', scentKo:'라벤더', vessel:'tall', bg:'#e1d2c1', ink:'#48372d', tone:'라벤더 · Lavender', description:'머릿결 정돈 및 단백질 코팅.', descriptionStatus:'source-confirmed' },
  { id:'04', studioBg:'#e8e4e2', studioInk:'#453d36', number:'04', name:'BODY WASH', ko:'바디 워시', patternKey:'chevron', patternName:'Chevron', patternKo:'반복 지그재그', scent:'Peony', scentKo:'피오니', vessel:'tall', bg:'#eae6de', ink:'#423c32', tone:'피오니 · Peony', description:'미끄러지는 부드러운 결.', descriptionStatus:'source-confirmed' },
  { id:'05', studioBg:'#eeeded', studioInk:'#47413b', number:'05', name:'BODY LOTION', ko:'바디 로션', patternKey:'diagonal', patternName:'Diagonal Lines', patternKo:'사선 스트라이프', scent:'Chamomile', scentKo:'캐모마일', vessel:'round', bg:'#eee9e3', ink:'#484039', tone:'캐모마일 · Chamomile', description:'몸 전체에 고르게 퍼지는 텍스처.', descriptionStatus:'source-confirmed', descriptionSource:'LUUM_editorial/리플렛_0608완성본수정.ai' },
];

export const chapters = [
  { title:'The object', label:'오브제' },
  { title:'The golden geometry', label:'금빛 패턴' },
  { title:'The finishing touch', label:'디테일' },
  { title:'The signature', label:'시그니처' },
  { title:'The collection', label:'컬렉션 피날레' },
];

export const storyLines = [
  '욕실에 수증기가 차오르면,',
  '익숙한 것들도 흐릿해집니다.',
  '우리는 왜, 모든 것을 눈으로 구별해야 할까요?',
  '보지 않아도 알 수 있다면 어떨까?',
  'LUUM은 제품의 차이를 형태와 촉각으로 번역합니다.',
  '손끝으로 구분하고, 감각으로 이해하는 케어.',
  '보지 않아도 알 수 있는 확신. LUUM.',
];
