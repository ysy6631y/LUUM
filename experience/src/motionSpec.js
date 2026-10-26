// Timeline units describe scroll progress, not seconds of autoplay.
export const motionSpec = {
  desktopDistance: 1.35,
  mobileDistance: 1.05,
  sceneDuration: 2.8,
  transition: 0.72,
  textDelay: 0.22,
  scrub: 0.45,
  mobileScrub: 0.2,
};
export function sceneAt(progress, count) {
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}
export function sceneProgress(index, count) {
  return (index + 0.38) / count;
}
