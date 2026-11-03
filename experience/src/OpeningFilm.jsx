import React, { useEffect, useRef, useState } from 'react';
import { asset } from './content';

export function OpeningFilm({ enabled }) {
  const ref = useRef(null);
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);


  useEffect(() => {
    const video = ref.current;
    video.playbackRate = .3;
    video.defaultPlaybackRate = .3;
    let visible = false;
    const sync = () => {
      if (enabled && visible && !document.hidden && !paused && !failed) {
        video.play().catch(() => setPlaying(false));
      } else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: .05 });
    observer.observe(video);
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const reduce = () => { if (motion.matches) setPaused(true); };
    motion.addEventListener('change', reduce);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      video.pause();
      motion.removeEventListener('change', reduce);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [enabled, paused, failed]);

  const toggle = () => {
    const video = ref.current;
    if (video.paused) {
      setPaused(false);
      video.play().catch(() => setPlaying(false));
    } else {
      setPaused(true);
      video.pause();
    }
  };

  return <>
    <video key="luum-film-720" ref={ref} className="opening-video" autoPlay={enabled && !paused}
      poster={asset('brand/luum-opening-poster.jpg')} preload="auto" muted loop playsInline
      aria-label="LUUM의 반투명 패브릭이 부드럽게 움직이는 오프닝 영상"
      onLoadedData={() => setFailed(false)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}>
      <source src={asset('brand/luum-opening-720.mp4')} type="video/mp4" />
      <source src={asset('brand/luum-opening-720.webm')} type="video/webm" />
    </video>
    {!failed && <button className="film-toggle glass-control" onClick={toggle} aria-label={playing ? '오프닝 영상 일시정지' : '오프닝 영상 재생'}>
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        {playing ? <path d="M7 5v10M13 5v10" /> : <path d="m7 5 7 5-7 5z" />}
      </svg>
    </button>}
  </>;
}
