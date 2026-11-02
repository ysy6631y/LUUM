export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
// Editorial working names describe the supplied objects, without inventing formulas or claims.
export const products = [
  { id: '01', name: 'UMBER', ko: '엄버', tone: 'Deep brown stone', bg: '#d6cec2', ink: '#393029', description: '깊은 브라운 스톤 위로,\n금빛 기하학의 결이 고요히 드러납니다.' },
  { id: '02', name: 'SIENNA', ko: '시에나', tone: 'Warm brown stone', bg: '#e1d2c1', ink: '#48372d', description: '따뜻한 브라운의 표면과\n섬세한 금빛 선이 만나는 순간.' },
  { id: '03', name: 'SAND', ko: '샌드', tone: 'Soft brown stone', bg: '#e8dcd0', ink: '#4b3b31', description: '부드러운 스톤의 온기,\n그 위에 새겨진 빛의 리듬.' },
  { id: '04', name: 'IVORY', ko: '아이보리', tone: 'Ivory stone', bg: '#eae6de', ink: '#423c32', description: '아이보리 스톤의 차분한 질감에\n금빛 패턴이 은은하게 빛납니다.' },
  { id: '05', name: 'PEARL', ko: '펄', tone: 'Pale stone · round form', bg: '#eee9e3', ink: '#484039', description: '낮고 둥근 실루엣을 따라,\n빛이 부드럽게 머무릅니다.' },
];
export const chapters = [
  { title: 'The object', label: '오브제' },
  { title: 'The golden geometry', label: '금빛 패턴' },
  { title: 'The finishing touch', label: '디테일' },
  { title: 'The signature', label: '시그니처' },
  { title: 'The collection', label: '컬렉션 피날레' },
];
