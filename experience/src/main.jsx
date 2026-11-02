import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import { products, chapters, storyLines, asset } from './content';
import { Cursor } from './Cursor';
import { Pattern } from './Pattern';
import './styles.css';
gsap.registerPlugin(ScrollTrigger);
const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const seenIntro = () => { try{return sessionStorage.getItem('luum-loaded')==='true';}catch{return false;} };

function App(){
  const app=useRef(null),canvas=useRef(null),controller=useRef(null),selectRef=useRef(null);
  const [selected,setSelected]=useState(0),[progress,setProgress]=useState(0),[ready,setReady]=useState(false),[fallback,setFallback]=useState(false);
  const [loading,setLoading]=useState(()=>!seenIntro()),[chapter,setChapter]=useState(0),[hovered,setHovered]=useState(null);
  const product=products[selected];
  const navigate=(id)=>document.getElementById(id)?.scrollIntoView({behavior:prefersReduced()?'instant':'smooth'});
  const jump=index=>{const el=document.getElementById('showcase');window.scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*index/4,behavior:prefersReduced()?'instant':'smooth'});};
  const choose=index=>{
    if(!ready)return;setSelected(index);controller.current?.select(index);
    gsap.to(app.current,{'--scene-bg':products[index].bg,'--ink':products[index].ink,duration:prefersReduced()?.01:1.8,ease:'sine.inOut',overwrite:'auto'});
  };
  selectRef.current=choose;

  useEffect(()=>{
    let disposed=false;
    const fonts=document.fonts.ready;
    const image=new Image();image.src=asset('brand/luum-sheer.webp');
    const visual=image.decode().catch(()=>{});
    const essentials=Promise.all([fonts,visual]);
    const finish=async()=>{await essentials;if(!disposed){setProgress(100);setReady(true);controller.current?.enter();}};
    const fail=()=>{if(disposed)return;controller.current?.dispose();controller.current=null;setFallback(true);finish();};
    import('./scene').then(({ProductScene})=>{
      if(disposed)return;
      try{controller.current=new ProductScene(canvas.current,{onProgress:n=>!disposed&&setProgress(Math.round(n*.9)),onReady:finish,onError:fail,onPick:i=>{selectRef.current(i);jump(0);}});}catch{fail();}
    }).catch(fail);
    return()=>{disposed=true;controller.current?.dispose();};
  },[]);
  useEffect(()=>{
    document.body.classList.toggle('locked',loading);
    if(!ready||!loading)return;
    const t=gsap.to('.preloader',{autoAlpha:0,duration:prefersReduced()?.01:.8,ease:'sine.inOut',onComplete:()=>{try{sessionStorage.setItem('luum-loaded','true');}catch{}setLoading(false);}});
    return()=>{t.kill();document.body.classList.remove('locked');};
  },[ready,loading]);

  useEffect(()=>{
    if(loading)return;
    const media=gsap.matchMedia();
    media.add({reduce:'(prefers-reduced-motion: reduce)',motion:'(prefers-reduced-motion: no-preference)'},context=>{
      const reduce=context.conditions.reduce;
      const ctx=gsap.context(()=>{
        const opening=gsap.timeline({scrollTrigger:{trigger:'#opening',start:'top top',end:'bottom top',scrub:reduce?true:.65}});
        opening.to('.opening-title',{yPercent:-20,opacity:0,filter:reduce?'none':'blur(9px)',duration:.65},.1)
          .to('.opening-haze',{opacity:0,scale:1.1,duration:1},0)
          ;
        if(!reduce) gsap.fromTo('.brand-pattern-band',{y:30},{y:-30,ease:'none',scrollTrigger:{trigger:'#brand-story',start:'top bottom',end:'bottom top',scrub:1}});
        const productTl=gsap.timeline({scrollTrigger:{trigger:'#showcase',start:'top top',end:'bottom bottom',scrub:reduce?true:.65,onUpdate:s=>setChapter(Math.min(4,Math.round(s.progress*4)))}});
        gsap.set('.product-copy:not(.hero-copy)',{autoAlpha:0,y:15});
        productTl.to({},{duration:4},0).to('.hero-copy',{autoAlpha:0,y:-15,duration:.3},.2);
        ['.detail-copy','.ring-copy','.signature-copy','.lineup-copy'].forEach((name,i)=>{
          productTl.to(name,{autoAlpha:1,y:0,duration:.25},i+.72);
          if(i<3)productTl.to(name,{autoAlpha:0,y:-15,duration:.25},i+1.25);
        });
        ScrollTrigger.create({trigger:'#showcase',start:'top bottom',end:'bottom top',onUpdate:()=>{
          const el=document.getElementById('showcase'),r=el.getBoundingClientRect();
          const reveal=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight*.45)),Math.max(0,r.bottom/(innerHeight*.5)));
          app.current.style.setProperty('--viewer',reveal);
          app.current.dataset.viewing=reveal>.5?'true':'false';
          canvas.current.tabIndex=reveal>.5?0:-1;
          canvas.current.setAttribute('aria-hidden',reveal>.5?'false':'true');
        },onLeave:()=>{app.current.style.setProperty('--viewer',0);app.current.dataset.viewing='false';canvas.current.tabIndex=-1;canvas.current.setAttribute('aria-hidden','true');},onLeaveBack:()=>{app.current.style.setProperty('--viewer',0);app.current.dataset.viewing='false';canvas.current.tabIndex=-1;canvas.current.setAttribute('aria-hidden','true');}});

      },app);
      return()=>ctx.revert();
    });
    ScrollTrigger.refresh();
    return()=>media.revert();
  },[loading]);

  const inspect=(index)=>{choose(index);jump(1);};
  return <div ref={app} className={`experience ${fallback?'is-fallback':''}`} data-chapter={chapter} data-viewing="false" style={{'--scene-bg':products[0].bg,'--ink':products[0].ink}}>
    <Cursor/>
    <a className="skip-link" href="#showcase">제품 탐색으로 건너뛰기</a>
    {loading&&<div className="preloader" role="status" aria-label="LUUM 필수 에셋 로딩"><span className="brand">LUUM</span><div className="loading-line"><i style={{transform:`scaleX(${progress/100})`}}/></div><span className="loading-count">{String(progress).padStart(2,'0')}</span><span className="sr-only">{progress}% 로딩</span></div>}
    <div className="journey" inert={loading?true:undefined}>
      <header className="site-header"><a href="#brand-story" className="header-link" onClick={e=>{e.preventDefault();navigate('brand-story');}}>The story</a><a className="wordmark brand" href="#opening" aria-label="LUUM 처음으로" onClick={e=>{e.preventDefault();navigate('opening');}}>LUUM</a><a className="header-link" href="#collection" onClick={e=>{e.preventDefault();navigate('collection');}}>The collection <span>05</span></a></header>
      <main>
        <section id="opening" aria-label="LUUM 시네마틱 오프닝">
          <div className="opening-frame"><img className="opening-fabric" src={asset('brand/luum-sheer.webp')} alt=""/><div className="opening-haze" aria-hidden="true"/>
            <div className="opening-title"><p className="eyebrow">Beyond the visible</p><h1 className="brand" aria-label="LUUM">{'LUUM'.split('').map((l,i)=><span key={i} style={{'--letter':i}} aria-hidden="true">{l}</span>)}</h1><p className="opening-description">눈을 감아도, 선명해지는 감각.</p></div>
            <button className="opening-scroll" onClick={()=>navigate('brand-story')}>Scroll to feel<span className="scroll-thread" aria-hidden="true"/></button><span className="opening-edition">A tactile care experience</span>
          </div>
        </section>
        <section id="brand-story" className="brand-editorial" aria-label="LUUM 브랜드 스토리"><img className="editorial-fabric" src={asset('brand/luum-sheer.webp')} alt=""/>
          <div className="brand-pattern-band" aria-hidden="true">{products.map(p=><Pattern key={p.id} type={p.patternKey}/>)}</div>
          <div className="brand-editorial-copy">
            <p className="eyebrow">The language of touch</p>
            <div className="brand-copy-column"><p>{storyLines[0]}<br/>{storyLines[1]}</p><p>{storyLines[2]}<br/>{storyLines[3]}</p></div>
            <div className="brand-copy-column"><p className="brand-fallback">{storyLines[4]}</p><p>{storyLines[5]}</p><p className="brand-fallback">{storyLines[6]}</p></div>
          </div>
        </section>
        <section id="showcase" aria-label="LUUM 인터랙티브 3D 제품 탐색">
          <div className="product-frame">
    <canvas ref={canvas} className="product-canvas" tabIndex={-1} aria-hidden="true" role="img" aria-label={`LUUM ${product.name} 3D 제품. 드래그 또는 좌우 방향키로 회전하세요.`} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();controller.current?.rotate(e.key==='ArrowRight'?.25:-.25);}}}/>
    {fallback&&<div className="fallback-stage"><img src={asset(`models/luum-${product.id}.png`)} alt={`LUUM ${product.name} 원본 모델 렌더링`}/><p>제품 이미지로 감상 중입니다</p></div>}

            <section className="product-copy hero-copy" id="object-description"><span className="eyebrow">Care, made tangible</span><h2 className="product-title brand">{product.name}</h2><p>{product.patternName} <span>·</span> {product.scentKo}</p><button className="detail-action" onClick={()=>jump(1)}>패턴 가까이 보기 <span>↗</span></button></section>
            <section className="product-copy detail-copy"><span className="eyebrow">01 / The pattern</span><h2 className="brand">TOUCH<br/>THE DIFFERENCE</h2><p>{product.patternKo}<br/>{product.scentKo}의 향</p></section>
            <section className="product-copy ring-copy"><span className="eyebrow">02 / The finishing touch</span><h2 className="brand">A TRACE<br/>OF GOLD</h2><p>손끝에 남는, 한 줄의 빛.</p></section>
            <section className="product-copy signature-copy"><span className="eyebrow">03 / The signature</span><h2 className="brand">A QUIET<br/>SIGNATURE</h2><p>형태에 새겨진 이름.</p></section>
            <section className="product-copy lineup-copy"><h2 className="brand">FIVE FORMS. ONE LUUM.</h2><button onClick={()=>navigate('collection')} className="detail-action">다섯 가지 패턴 살펴보기 <span>↓</span></button></section>
            <aside className="chapter-rail" aria-label="제품 장면 탐색">{chapters.map((c,i)=><button key={c.title} onClick={()=>jump(i)} className={chapter===i?'active':''} aria-label={c.label} aria-current={chapter===i?'step':undefined}><span>{c.label}</span><i/></button>)}</aside>
            <nav className="product-selector" aria-label="제품 선택">{products.map((p,i)=><button key={p.id} onClick={()=>choose(i)} disabled={!ready} aria-label={`${p.name} ${p.ko} 보기`} aria-pressed={selected===i} className={selected===i?'selected':''}><img src={asset(`models/luum-${p.id}.png`)} alt=""/><span>{p.name}</span><i/></button>)}</nav>
            <span className="sr-only" aria-live="polite">{product.name} {product.ko} {product.scentKo}</span>
          </div>
        </section>
        <section id="collection" className="pattern-collection" aria-labelledby="collection-title">
          <div className="collection-intro"><p className="eyebrow">The language of touch</p><h2 id="collection-title" className="brand">FIVE DISTINCT<br/>SENSATIONS.</h2><p>손끝으로 읽는 다섯 가지 차이.</p></div>
          <div className="collection-grid" onMouseLeave={()=>setHovered(null)}>{products.map((p,i)=><article key={p.id} className={hovered===i?'is-inspected':''} onMouseEnter={()=>setHovered(i)}>
            <button className="pattern-inspect" onClick={()=>inspect(i)} onFocus={()=>setHovered(i)} onBlur={()=>setHovered(null)} aria-label={`${p.name} ${p.patternName} 3D 디테일 보기`}><span className="collection-number">{p.number}</span><Pattern type={p.patternKey}/><img className="pattern-product" src={asset(`models/luum-${p.id}.png`)} alt="" loading="lazy"/><span className="inspect-label">3D 디테일 보기 ↗</span></button>
            <h3 className="brand">{p.name}</h3><p className="pattern-name">{p.patternName}</p><p className="product-description">{p.description}</p><p className="scent">{p.scentKo}<span>{p.scent}</span></p>{p.descriptionStatus==='needs-confirmation'&&<small className="description-note">세부 제품 설명 확인 필요</small>}
          </article>)}</div>
        </section>
        <footer className="ending" id="ending"><p className="eyebrow">Certainty, beyond sight.</p><div className="ending-logo brand" aria-label="LUUM">LUUM</div><p className="ending-copy">보지 않아도 알 수 있는 확신. <span className="brand">LUUM.</span></p><a href="#opening" onClick={e=>{e.preventDefault();navigate('opening');}} className="back-to-top">처음으로 ↑</a><span className="ending-foot">LUUM — A tactile care experience</span></footer>
      </main>
    </div>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
