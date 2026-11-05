import React, {useEffect, useRef, useState} from 'react';

const RETURN_AFTER = 60_000;
const WARNING_BEFORE = 5_000;

export function ExhibitionIdleReturn({onReturn}) {
  const callback = useRef(onReturn);
  callback.current = onReturn;
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    let lastActivity = Date.now();
    let pointer = null;
    const pressed = new Set();
    const activity = event => {
      if (event.type === 'pointermove') {
        const next = {x:event.clientX, y:event.clientY};
        if (pointer && Math.hypot(next.x-pointer.x, next.y-pointer.y) < 6) return;
        pointer = next;
      }
      if (event.type === 'pointerdown') pressed.add(event.pointerId);
      if (event.type === 'pointerup' || event.type === 'pointercancel') pressed.delete(event.pointerId);
      lastActivity = Date.now();
      setRemaining(null);
    };
    const tick = () => {
      if (document.hidden || pressed.size) return;
      // The opening is already the exhibition's resting screen.
      const openingVideo = document.querySelector('#exhibition-opening video');
      if (scrollY < 8 && openingVideo && !openingVideo.paused) { lastActivity = Date.now(); setRemaining(null); return; }
      const left = RETURN_AFTER - (Date.now() - lastActivity);
      if (left <= 0) {
        lastActivity = Date.now();
        setRemaining(null);
        callback.current();
      } else setRemaining(left <= WARNING_BEFORE ? Math.ceil(left/1000) : null);
    };
    const blur = () => pressed.clear();
    const events = ['pointermove','pointerdown','pointerup','pointercancel','wheel','scroll','keydown'];
    const options = {passive:true, capture:true};
    for (const event of events) window.addEventListener(event, activity, options);
    window.addEventListener('blur', blur);
    const interval = window.setInterval(tick, 250);
    return () => {
      window.clearInterval(interval);
      for (const event of events) window.removeEventListener(event, activity, options);
      window.removeEventListener('blur', blur);
    };
  }, []);

  return remaining === null ? null : <div className="exhibition-idle-notice" role="status" aria-live="polite">
    <span>{remaining}초 후 첫 영상으로 돌아갑니다.</span>
    <span>계속 보려면 화면을 조작해 주세요.</span>
  </div>;
}
