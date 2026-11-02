import React, { useEffect, useRef } from 'react';

export function Cursor() {
  const ref=useRef(null);
  useEffect(()=>{
    const media=matchMedia('(pointer: fine)');
    const cursor=ref.current;
    let frame, shown=false, down=false, x=-100,y=-100,sx=-100,sy=-100;
    const move=e=>{
      if(e.pointerType==='touch'||!media.matches)return;
      x=e.clientX;y=e.clientY;
      if(!shown){sx=x;sy=y;shown=true;document.documentElement.classList.add('custom-cursor');cursor.dataset.visible='true';}
      const experience=e.target.closest('.experience');
      cursor.dataset.mode=e.target.closest('button,a')?'link':e.target.closest('.product-canvas')?(experience?.classList.contains('is-gallery')||experience?.dataset.chapter==='4'?'choose':'rotate'):'idle';
    };
    const hide=()=>{shown=false;cursor.dataset.visible='false';document.documentElement.classList.remove('custom-cursor');};
    const press=()=>{down=true;cursor.dataset.down='true';};
    const release=()=>{down=false;cursor.dataset.down='false';};
    let previous=0;
    const draw=now=>{
      const dt=Math.min(.05,(now-(previous||now))/1000);previous=now;
      const ease=down?1:1-Math.exp(-dt*22);
      sx+=(x-sx)*ease;sy+=(y-sy)*ease;
      cursor.style.transform=`translate3d(${sx}px,${sy}px,0)`;
      frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);
    window.addEventListener('pointermove',move,{passive:true});
    window.addEventListener('pointerdown',press);window.addEventListener('pointerup',release);
    document.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);media.addEventListener('change',hide);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',press);window.removeEventListener('pointerup',release);document.removeEventListener('pointerleave',hide);window.removeEventListener('blur',hide);media.removeEventListener('change',hide);document.documentElement.classList.remove('custom-cursor');};
  },[]);
  return <div className="object-cursor" ref={ref} aria-hidden="true"><span className="cursor-ring"/><span className="cursor-dot"/></div>;
}
