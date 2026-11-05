const clamp = value => Math.min(1, Math.max(0, value));
const smooth = value => { const t=clamp(value); return t*t*(3-2*t); };

// Each product owns an entrance and a complete camera passage. The next product
// always starts with the whole vessel, never with the previous close-up pose.
export function productJourney(progress) {
  const raw=clamp(progress)*5;
  const index=Math.min(4,Math.floor(raw));
  const local=clamp(raw-index);
  let camera=0;
  // Arrive at each detail, then hold it while the visitor reads and rotates.
  if(local>.2) camera=clamp((local-.2)/.14);
  if(local>.5) camera=1+clamp((local-.5)/.10);
  if(local>.72) camera=2+clamp((local-.72)/.07);
  if(index===4&&local>.86) camera=3+clamp((local-.86)/.14);
  return {index,local,camera,arrival:smooth(local/.18),departure:index===4?0:smooth((local-.88)/.11)};
}

export const chapterLocal = [ .18, .5, .72, .86, 1 ];
export const journeyPosition = (index, local) => (index+local)/5;
export const cameraChapter = camera => camera<.4?0:camera<1.4?1:camera<2.4?2:camera<3.5?3:4;
