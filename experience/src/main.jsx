import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import { products, chapters, asset } from './content';
import { Cursor } from './Cursor';
import './styles.css';
gsap.registerPlugin(ScrollTrigger);

function Arrow({ direction = 'down' }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={`arrow arrow-${direction}`}><path d="M12 4v15M6 13l6 6 6-6"/></svg>;
}
function CollectionIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="6" cy="6" r="2.3"/><circle cx="14" cy="6" r="2.3"/><circle cx="6" cy="14" r="2.3"/><circle cx="14" cy="14" r="2.3"/></svg>;
}

function App() {
  const canvas = useRef(null), atmosphere = useRef(null), controller = useRef(null), app = useRef(null);
  const galleryButton = useRef(null), closeButton = useRef(null), selectRef = useRef(null);
  const [selected, setSelected] = useState(3);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [chapter, setChapter] = useState(0);
  const product = products[selected];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const jump = index => {
    window.scrollTo({ top: (document.documentElement.scrollHeight-innerHeight)*index/4, behavior: reduced()?'instant':'smooth' });
  };
  const choose = (index, close = true) => {
    if (!ready) return;
    controller.current?.select(index);
    setSelected(index);
    gsap.to(app.current, { '--scene-bg':products[index].bg, '--ink':products[index].ink, duration: reduced() ? .01 : 1.8, ease:'sine.inOut', overwrite:'auto' });
    if (close && gallery) setGallery(false);
    if ((close && gallery) || chapter===4) jump(0);
  };
  selectRef.current = choose;

  useEffect(() => {
    let disposed = false;
    const fail = () => {
      if (disposed) return;
      controller.current?.dispose();controller.current=null;
      setFallback(true);setReady(true);setProgress(100);
    };
    import('./scene').then(({ ProductScene }) => {
      if (disposed) return;
      try {
        controller.current = new ProductScene(canvas.current, {
          atmosphereCanvas:atmosphere.current,
          onProgress:n=>!disposed&&setProgress(n), onReady:()=>!disposed&&setReady(true),
          onError:fail, onPick:i=>selectRef.current(i),
        });
      } catch { fail(); }
    }).catch(fail);
    return () => {disposed=true;controller.current?.dispose();};
  }, []);

  useEffect(() => {
    document.body.classList.toggle('locked',!entered||gallery);
    controller.current?.setGallery(gallery);
    if (gallery) closeButton.current?.focus();
    const onKey = e => {
      if(e.key==='Escape'&&gallery){setGallery(false);galleryButton.current?.focus();}
      if(gallery&&e.key==='Tab'){
        const nodes=[...document.querySelectorAll('.collection-view button')];
        const first=nodes[0],last=nodes[nodes.length-1];
        if(e.shiftKey&&document.activeElement===first){last?.focus();e.preventDefault();}
        else if(!e.shiftKey&&document.activeElement===last){first?.focus();e.preventDefault();}
      }
    };
    window.addEventListener('keydown',onKey);
    return()=>{document.body.classList.remove('locked');window.removeEventListener('keydown',onKey);};
  },[entered,gallery]);

  useEffect(() => {
    if(!entered)return;
    const context=gsap.context(()=>{
      gsap.set('.story-layer:not(.hero-copy)',{autoAlpha:0,y:16});
      const tl=gsap.timeline({scrollTrigger:{
        trigger:'.scroll-track',start:'top top',end:'bottom bottom',scrub:reduced()?true:.65,
        onUpdate:s=>setChapter(previous=>{const next=Math.min(4,Math.round(s.progress*4));return previous===next?previous:next;}),
      }});
      tl.to({},{duration:4},0)
        .to('.hero-copy',{autoAlpha:0,y:-16,duration:.35},.2)
        .to('.detail-copy',{autoAlpha:1,y:0,duration:.3},.7)
        .to('.detail-copy',{autoAlpha:0,y:-16,duration:.3},1.25)
        .to('.ring-copy',{autoAlpha:1,y:0,duration:.3},1.7)
        .to('.ring-copy',{autoAlpha:0,y:-16,duration:.3},2.25)
        .to('.signature-copy',{autoAlpha:1,y:0,duration:.3},2.7)
        .to('.signature-copy',{autoAlpha:0,y:-16,duration:.25},3.25)
        .to('.ending-copy',{autoAlpha:1,y:0,duration:.35},3.65);
    },app);
    return()=>context.revert();
  },[entered]);

  const enter = () => {
    window.scrollTo({top:0,behavior:'instant'});controller.current?.enter();setEntered(true);
    requestAnimationFrame(()=>{ScrollTrigger.refresh();galleryButton.current?.focus({preventScroll:true});});
  };

  return <div ref={app} data-chapter={chapter} className={`experience ${entered?'is-entered':''} ${gallery?'is-gallery':''} ${fallback?'is-fallback':''}`} style={{'--scene-bg':products[3].bg,'--ink':products[3].ink}}>
    <Cursor/>
    <a className="skip-link" href="#object-description">제품 설명으로 건너뛰기</a>
    <div className="light-field" aria-hidden="true"><i/><i/><i/></div>
    <canvas ref={atmosphere} className="atmosphere-canvas" aria-hidden="true"/>
    <canvas ref={canvas} className="product-canvas" aria-label={`LUUM ${product.name} 실제 3D 제품. 드래그하여 회전하고 스크롤하여 디테일을 탐색하세요.`}/>
    {fallback&&<div className="fallback-stage" aria-label="제품 이미지로 탐색"><img src={asset(`models/luum-${product.id}.png`)} alt={`LUUM ${product.name} 원본 모델 렌더링`}/><p>제품 이미지로 감상 중입니다</p></div>}

    <div className={`opening ${ready?'is-ready':''} ${entered?'opening-out':''}`} aria-hidden={entered}>
      <div className="opening-wash" aria-hidden="true"/>
      <span className="opening-top">A quiet radiance</span>
      <div className="opening-center">
        <h1 className="opening-logo brand" aria-label="LUUM">{'LUUM'.split('').map((letter,i)=><span aria-hidden="true" key={i} style={{'--letter':i}}>{letter}</span>)}</h1>
        <p className="opening-kicker">Light, held in stone.</p>
        <button className="enter-button" onClick={enter} disabled={!ready} tabIndex={entered?-1:0}>
          <span className="enter-orbit" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" className="orbit-track"/><circle cx="32" cy="32" r="28" className="orbit-progress" style={{strokeDashoffset:176*(1-progress/100)}}/></svg>{ready?<Arrow direction="right"/>:<span className="loading-number">{String(progress).padStart(2,'0')}</span>}</span>
          <span>{ready?'컬렉션 감상하기':'빛을 준비하는 중'}</span>
        </button>
        <div className="sr-only" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="3D 컬렉션 로딩"/>
      </div>
      <span className="opening-foot">Stone. Gold. LUUM.</span>
    </div>

    <div className="main-interface" inert={!entered||gallery?true:undefined}>
      <header className="site-header">
        <button ref={galleryButton} className="collection-trigger" onClick={()=>setGallery(true)} aria-haspopup="dialog"><CollectionIcon/><span>컬렉션</span></button>
        <a href="#" className="wordmark brand" aria-label="LUUM 처음으로" onClick={e=>{e.preventDefault();jump(0);}}>LUUM</a>
        <span className="header-note">Light up your routine.</span>
      </header>
      <main className="scroll-track" aria-label="LUUM 제품과 디테일 탐색"><div className="content-layers">
        <section className="story-layer hero-copy" id="object-description" aria-label="선택한 제품">
          <h2 className="product-title brand" key={product.id}>{product.name}</h2>
          <p className="product-subtitle">{product.tone}</p>
          <button className="scroll-discover" onClick={()=>jump(1)}><span>Scroll to discover</span><span className="scroll-thread" aria-hidden="true"/></button>
        </section>
        <section className="story-layer detail-copy" aria-label="금빛 기하학 패턴">
          <h2 className="brand">GOLDEN<br/>GEOMETRY</h2><p>빛이 새겨진 표면.</p>
        </section>
        <section className="story-layer ring-copy" aria-label="상단 링 디테일">
          <h2 className="brand">A TRACE<br/>OF GOLD</h2><p>형태를 완성하는 한 줄의 빛.</p>
        </section>
        <section className="story-layer signature-copy" aria-label="하단 음각 로고">
          <h2 className="brand">THE LUUM<br/>SIGNATURE</h2><p>고요하게 남겨진 이름.</p>
        </section>
        <section className="story-layer ending-copy" aria-label="컬렉션 피날레">
          <h2 className="brand">FIVE FORMS<br/>ONE LUUM</h2>
          <button className="text-action" onClick={()=>jump(0)}>다시 감상하기 <Arrow direction="up"/></button>
        </section>
      </div></main>
      <aside className="chapter-rail" aria-label="장면 탐색">{chapters.map((c,i)=><button key={c.title} onClick={()=>jump(i)} className={chapter===i?'active':''} aria-label={c.label} aria-current={chapter===i?'step':undefined}><span>{c.label}</span><i/></button>)}</aside>
      <footer className="stage-footer">
        <span className="sr-only" aria-live="polite">{product.name} {product.ko}</span>
        <nav className="product-selector" aria-label="제품 선택">{products.map((p,i)=><button key={p.id} onClick={()=>choose(i,false)} aria-label={`${p.name} ${p.ko} 보기`} aria-pressed={selected===i} className={selected===i?'selected':''}><img src={asset(`models/luum-${p.id}.png`)} alt=""/><span className="selector-name">{p.name}</span><i/></button>)}</nav>
      </footer>
    </div>

    {gallery&&<div className="collection-view" role="dialog" aria-modal="true" aria-label="LUUM 다섯 가지 오브제 컬렉션">
      <div className="collection-header"><span>LUUM collection</span><span className="brand">LUUM</span><button ref={closeButton} onClick={()=>{setGallery(false);galleryButton.current?.focus();}} className="close-button" aria-label="컬렉션 닫기"><span/><span/></button></div>
      {fallback&&<div className="gallery-fallbacks">{products.map(p=><img key={p.id} src={asset(`models/luum-${p.id}.png`)} alt=""/>)}</div>}
      <div className="gallery-labels">{products.map((p,i)=><button key={p.id} onClick={()=>choose(i)} aria-label={`${p.name} 탐색`} className={i===selected?'current':''}><span className="gallery-number">{p.id}</span><span>{p.name}</span><i/></button>)}</div>
      <div className="collection-heading"><h2 className="brand">FIVE FORMS<br/>ONE LUUM</h2></div>
    </div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
