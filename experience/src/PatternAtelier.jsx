import React, {useEffect,useRef,useState} from 'react';
import {products,asset} from './content';
import {Pattern} from './Pattern';
import {CondensationSurface} from './condensation';

function PatternScene({product,active,mark,onInspect,onReveal,onReset,onWipe}){
  return <div className={`atelier-scene ${active?'is-active':''}`} aria-hidden={!active}>
    <div className="atelier-paper"><Pattern type={product.patternKey}/><div className="wipe-input" aria-hidden="true" onPointerDown={onWipe}/><span className="drawing-hint">안내선을 따라, 손끝으로 선을 따라가 보세요.</span></div>
    <div className="atelier-caption">
      <span className="atelier-count">{product.number} <i/> 05</span><h3 className="brand">{product.name}</h3><p className="atelier-pattern-name">{product.patternName}</p>
      <p className="atelier-description">{product.description}</p><p className="atelier-scent">{product.scentKo}<span>{product.scent}</span></p>
      <div className="drawing-actions"><button className="glass-control" tabIndex={active?0:-1} aria-pressed={mark.revealed} disabled={mark.revealed} onClick={onReveal}>패턴 보기</button><button className="glass-control" tabIndex={active?0:-1} disabled={!mark.count&&!mark.revealed} onClick={onReset}>다시 그리기</button></div>
      <button className="atelier-inspect glass-control" tabIndex={active?0:-1} onClick={onInspect} aria-label={`${product.name} ${product.patternName} 3D 디테일 보기`}>3D 디테일 보기 <span>↗</span></button>
      <span className="sr-only" role="status">{mark.revealed?'패턴 전체가 선명해졌습니다.':mark.count?`${mark.count}번 그은 부분의 패턴이 진해졌습니다.`:''}</span>
    </div>
  </div>;
}

export function PatternAtelier({onInspect}){
  const root=useRef(null),drawing=useRef(false),activeRef=useRef(0),updateRef=useRef(null),canvas=useRef(null),background=useRef(null),surface=useRef(null);
  const [active,setActive]=useState(0),[marks,setMarks]=useState(()=>products.map(()=>({count:0,revealed:false})));
  const guide=()=>root.current.querySelectorAll('.atelier-paper>.pattern')[activeRef.current];
  useEffect(()=>{const glass=new CondensationSurface(canvas.current,background.current,asset('brand/luum-sheer.webp'));surface.current=glass;glass.setPattern(activeRef.current,guide());return()=>glass.dispose();},[]);
  useEffect(()=>{surface.current?.setPattern(active,guide());},[active]);
  useEffect(()=>{
    let frame=0;
    const update=()=>{frame=0;const e=root.current,r=e.getBoundingClientRect(),h=innerHeight,progress=Math.max(0,Math.min(1,-r.top/Math.max(1,e.offsetHeight-h))),index=Math.min(4,Math.floor(progress*5));if(index!==activeRef.current&&!drawing.current){activeRef.current=index;setActive(index);}e.style.setProperty('--atelier-entry',Math.max(0,Math.min(1,(h-r.top)/(h*.85))));e.dataset.pattern=String(activeRef.current);};
    const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};updateRef.current=queue;update();window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);};
  },[]);
  const sync=()=>{const g=surface.current,index=activeRef.current;if(g)setMarks(old=>old.map((mark,i)=>i===index?{count:g.state.strokes.length,revealed:g.state.revealed}:mark));};
  const finish=()=>{if(!surface.current?.finish())return;sync();drawing.current=false;updateRef.current?.();};
  const choose=index=>{finish();const e=root.current;activeRef.current=index;setActive(index);window.scrollTo({top:e.offsetTop+(e.offsetHeight-innerHeight)*(index+.35)/5,behavior:'instant'});};
  const point=e=>{const r=canvas.current.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};};
  const start=e=>{if(e.button!==0||(e.pointerType==='touch'&&!e.target.closest('.wipe-input')))return;e.preventDefault();if(surface.current?.begin(point(e))){canvas.current.setPointerCapture(e.pointerId);drawing.current=true;}};
  return <section ref={root} id="collection" className="pattern-collection pattern-atelier" aria-labelledby="collection-title" data-pattern="0">
    <div className="atelier-transition" aria-hidden="true"/>
    <div className="atelier-frame">
      <div className="condensation-layer"><canvas ref={background} className="condensation-background" aria-hidden="true"/><canvas ref={canvas} className="pattern-drawing" role="img" aria-label={`${products[active].name} 습기 질감 배경. 안내선을 따라 그으면 해당 패턴 선이 진해집니다. 패턴 보기 버튼으로도 확인할 수 있습니다.`}
        onPointerDown={start}
        onPointerMove={e=>{if(surface.current?.current)surface.current.move(point(e));}} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}/></div>
      <div className="atelier-heading"><p className="eyebrow">The language of touch</p><h2 id="collection-title">손끝으로 읽는<br/>다섯 가지 차이.</h2><p>흐릿한 시선 너머,<br/>손끝으로 드러나는 차이.</p></div>
      <div className="atelier-stage">{products.map((product,index)=><PatternScene key={product.id} product={product} active={active===index} mark={marks[index]} onWipe={start} onInspect={()=>onInspect(index)} onReveal={()=>{surface.current?.reveal();sync();}} onReset={()=>{surface.current?.reset();sync();}}/>)}</div>
      <nav className="atelier-navigation" aria-label="패턴 탐색">{products.map((product,index)=><button key={product.id} onClick={()=>choose(index)} aria-label={`${product.name} 패턴 보기`} aria-current={active===index?'step':undefined}><span>{product.number}</span><i/><span className="atelier-nav-name">{product.name}</span></button>)}</nav>
    </div>
  </section>;
}
