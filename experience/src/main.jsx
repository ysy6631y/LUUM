import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import { products, chapters, storyLines, asset } from './content';
import { Cursor } from './Cursor';
import { Pattern } from './Pattern';
import { PatternAtelier } from './PatternAtelier';
import { OpeningFilm } from './OpeningFilm';
import { productJourney, chapterLocal, journeyPosition, cameraChapter } from './journey';
import './styles.css';
gsap.registerPlugin(ScrollTrigger);
const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const headerItems=[['Home','exhibition-opening'],['Ritual','brand-story'],['Texture','collection'],['Product','showcase'],['Contact','ending']];

function App(){
  const app=useRef(null),canvas=useRef(null),controller=useRef(null),selectRef=useRef(null);
  const [selected,setSelected]=useState(0),[progress,setProgress]=useState(0),[ready,setReady]=useState(false),[fallback,setFallback]=useState(false);
  const loading=false;
  const [chapter,setChapter]=useState(0);
  const product=products[selected];
  const navigate=(id)=>document.getElementById(id)?.scrollIntoView({behavior:prefersReduced()?'instant':'smooth'});
  const jump=(chapter,index=selected)=>{const el=document.getElementById('showcase');const position=chapter===4?1:journeyPosition(index,chapterLocal[chapter]);window.scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*position,behavior:'instant'});};
  const applyProduct=index=>{
    if(!ready&&!controller.current?.ready)return;
    if(index===selected)return;
    setSelected(index);controller.current?.select(index);
    gsap.to(app.current,{'--scene-bg':products[index].studioBg,'--ink':products[index].studioInk,duration:prefersReduced()?.01:2.4,ease:'sine.inOut',overwrite:'auto'});
  };
  const choose=index=>{applyProduct(index);jump(0,index);};
  const present=({chapter,presence})=>{const root=app.current;if(!root)return;if(root.dataset.chapter!==String(chapter)){root.dataset.chapter=String(chapter);setChapter(chapter);}root.style.setProperty('--chapter-presence',presence);};
  selectRef.current=applyProduct;

  useEffect(()=>{const resize=()=>{if(app.current)app.current.style.setProperty('--header-scale',innerWidth<700?1:Math.max(.72,Math.min(innerWidth/1920,innerHeight/1080)));};resize();window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);

  useEffect(()=>{
    let disposed=false;
    const fonts=document.fonts.ready;
    const essentials=Promise.all([fonts]);
    const finish=async()=>{await essentials;if(!disposed){setProgress(100);setReady(true);controller.current?.enter();}};
    const fail=()=>{if(disposed)return;controller.current?.dispose();controller.current=null;setFallback(true);finish();};
    import('./scene').then(({ProductScene})=>{
      if(disposed)return;
      try{controller.current=new ProductScene(canvas.current,{onProgress:n=>!disposed&&setProgress(Math.round(n*.9)),onReady:finish,onError:fail,onPick:i=>{selectRef.current(i);jump(0,i);},onSequence:i=>selectRef.current(i),onJourney:present});}catch{fail();}
    }).catch(fail);
    return()=>{disposed=true;controller.current?.dispose();};
  },[]);
  useEffect(()=>{
    if(loading)return;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    let updateStory;
    const ctx=gsap.context(self=>{
        ScrollTrigger.create({trigger:'#exhibition-opening',start:'top top',end:'bottom top',onToggle:s=>{app.current.dataset.exhibitionViewing=s.isActive?'true':'false';}});
        const opening=gsap.timeline({scrollTrigger:{trigger:'#opening',start:'top top',end:'bottom bottom',scrub:true}});
        opening.fromTo('.opening-frost',{'--frost-edge':'120%'},{'--frost-edge':'-20%',ease:'none',duration:1},0);
        ScrollTrigger.create({trigger:'.intro-journey',start:'top top',end:'bottom top',onToggle:s=>{app.current.dataset.introViewing=s.isActive?'true':'false';}});
        const story=gsap.timeline({scrollTrigger:{trigger:'#brand-story',start:'top 25%',end:'bottom bottom',scrub:true}});
        self.add('updateStory',()=>{
          const progress=story.progress();story.clear();
          gsap.set('.story-line',{clearProps:'filter,transform,clipPath,opacity,visibility'});
          if(preference.matches){story.to({},{duration:1});gsap.set('.story-line',{autoAlpha:1});}
          else{
          story.to({},{duration:1},0)
            .fromTo('.line-01',{autoAlpha:0,filter:'blur(3px)'},{autoAlpha:1,filter:'blur(0px)',duration:.14},0)
            .fromTo('.line-02',{autoAlpha:0,y:12},{autoAlpha:1,y:0,duration:.14},.05)
            .fromTo('.line-03',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.16},.16)
            .fromTo('.line-04',{autoAlpha:0,scale:.995},{autoAlpha:1,scale:1,duration:.16},.24)
            .fromTo('.line-05',{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:.18},.34)
            .fromTo('.line-06',{autoAlpha:0,filter:'blur(2px)'},{autoAlpha:1,filter:'blur(0px)',duration:.18},.42)
            .fromTo('.line-07',{autoAlpha:0,y:8},{autoAlpha:1,y:0,duration:.16},.52);
          }
          story.progress(progress);
        });
        updateStory=self.updateStory;updateStory();
        ScrollTrigger.create({trigger:'#showcase',start:'top top',end:'bottom bottom',onUpdate:s=>{if(!controller.current){const j=productJourney(s.progress);selectRef.current(j.index);present({chapter:cameraChapter(j.camera),presence:Math.min(j.arrival*1.5,1)*(1-j.departure)});}}});
        ScrollTrigger.create({trigger:'#ending',start:'top 65px',end:'bottom top',onToggle:s=>{app.current.dataset.footerViewing=s.isActive?'true':'false';}});
        ScrollTrigger.create({trigger:'#showcase',start:'top bottom',end:'bottom top',onUpdate:()=>{
          const el=document.getElementById('showcase'),r=el.getBoundingClientRect();
          const reveal=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight*.45)),Math.max(0,r.bottom/(innerHeight*.5)));
          app.current.style.setProperty('--viewer',reveal);
          app.current.dataset.viewing=reveal>.5?'true':'false';
          canvas.current.tabIndex=reveal>.5?0:-1;
          canvas.current.setAttribute('aria-hidden',reveal>.5?'false':'true');
        },onLeave:()=>{app.current.style.setProperty('--viewer',0);app.current.dataset.viewing='false';canvas.current.tabIndex=-1;canvas.current.setAttribute('aria-hidden','true');},onLeaveBack:()=>{app.current.style.setProperty('--viewer',0);app.current.dataset.viewing='false';canvas.current.tabIndex=-1;canvas.current.setAttribute('aria-hidden','true');}});

    },app);
    // Keep ScrollTriggers mounted when the preference changes. Rebuilding them
    // restored the initial scroll position and interrupted an active product view.
    preference.addEventListener('change',updateStory);
    ScrollTrigger.refresh();
    return()=>{preference.removeEventListener('change',updateStory);ctx.revert();};
  },[loading]);

  const inspect=(index)=>{applyProduct(index);jump(1,index);};
  return <div ref={app} className={`experience ${fallback?'is-fallback':''}`} data-exhibition-viewing="true" data-entry={loading?'true':'false'} data-chapter={chapter} data-viewing="false" data-intro-viewing="true" style={{'--scene-bg':products[0].studioBg,'--ink':products[0].studioInk}}>
    <Cursor/>
    <a className="skip-link" href="#showcase" tabIndex={loading?-1:0}>제품 탐색으로 건너뛰기</a>
    <div className="journey" inert={loading?true:undefined}>
      <header className="site-header">
        <a className="wordmark brand" href="#exhibition-opening" aria-label="LUUM 처음으로" onClick={e=>{e.preventDefault();navigate('exhibition-opening');}}>LUUM</a>
        <nav className="header-nav" aria-label="Primary navigation">{headerItems.map(([name,id])=><a key={name} href={`#${id}`} onClick={e=>{e.preventDefault();id==='showcase'?choose(0):navigate(id);}}>{name}</a>)}</nav>
        <div className="header-right"><span className="header-login" aria-disabled="true">Login</span><details className="header-menu"><summary aria-label="메뉴 열기"><span/><span/></summary><nav aria-label="전체 메뉴">{headerItems.map(([name,id])=><a key={name} href={`#${id}`} onClick={e=>{e.preventDefault();e.currentTarget.closest('details').open=false;id==='showcase'?choose(0):navigate(id);}}>{name}</a>)}</nav></details></div>
      </header>

      <main>
        <section id="exhibition-opening" className="exhibition-opening" aria-label="LUUM 제품 영상 오프닝">
          <OpeningFilm enabled={true} productFilm/>
          <button className="exhibition-scroll" onClick={()=>navigate('brand-story')}>
            Scroll to explore <svg viewBox="0 0 20 36" aria-hidden="true"><path d="M10 2v30M3 25l7 7 7-7"/></svg>
          </button>
        </section>
        <div className="intro-journey">
          <div className="intro-atmosphere"><OpeningFilm enabled={true}/></div>
        <div className="intro-content">
        <section id="opening" aria-label="LUUM 시네마틱 오프닝">
          <div className="opening-frame"><div className="opening-frost" aria-hidden="true"/>
            <h1 className="sr-only" id="opening-title" tabIndex={-1}>LUUM</h1>
          </div>
        </section>
        <section id="brand-story" className="brand-editorial" aria-label="LUUM 브랜드 스토리">
          <div className="story-frame"><div className="brand-editorial-copy">
            <div className="story-preamble"><p className="story-line line-01">{storyLines[0]}</p><p className="story-line line-02">{storyLines[1]}</p></div>
            <div className="story-questions"><p className="story-line line-03">{storyLines[2]}</p><p className="story-line line-04">{storyLines[3]}</p></div>
            <div className="story-response"><p className="story-line line-05">{storyLines[4]}</p><p className="story-line line-06">{storyLines[5]}</p></div>
            <p className="story-line story-certainty line-07">{storyLines[6]}</p>
          </div></div>
        </section>
        </div>
        </div>
        <section id="showcase" aria-label="LUUM 인터랙티브 3D 제품 탐색">
          <div className="product-frame">
    <canvas ref={canvas} className="product-canvas" tabIndex={-1} aria-hidden="true" role="img" aria-label={`LUUM ${product.name} 3D 제품. 드래그 또는 좌우 방향키로 회전하세요.`} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();controller.current?.rotate(e.key==='ArrowRight'?.25:-.25);}}}/>
    {fallback&&<div className="fallback-stage" style={{'--poster-scale':product.vessel==='round'?.135/.26:1,'--poster-bottom':(product.vessel==='round'?630:669)/760}}><img src={asset(`models/luum-${product.id}.png`)} alt={`LUUM ${product.name} 원본 모델 렌더링`}/><p>제품 이미지로 감상 중입니다</p></div>}

            <section className="product-copy hero-copy" id="object-description"><h2 className="product-title brand">{product.name}</h2><p>{product.patternName} <span>·</span> {product.scentKo}</p><p className="hero-description">{product.description}<br/>손끝으로 알아보는 {product.patternKo}.</p><button className="detail-action glass-control" onClick={()=>jump(1)}>패턴 가까이 보기 <span>↗</span></button></section>
            <section className="product-copy detail-copy"><span className="eyebrow">01 / The pattern</span><h2 className="brand">TOUCH<br/>THE DIFFERENCE</h2><p>{product.patternKo}<br/>{product.scentKo}의 향</p></section>
            <section className="product-copy ring-copy"><span className="eyebrow">02 / The finishing touch</span><h2 className="brand">A TRACE<br/>OF GOLD</h2><p>손끝에 남는, 한 줄의 빛.</p></section>
            <section className="product-copy signature-copy"><span className="eyebrow">03 / The signature</span><h2 className="brand">A QUIET<br/>SIGNATURE</h2><p>형태에 새겨진 이름.</p></section>
            <section className="product-copy lineup-copy"><h2 className="brand">FIVE FORMS. ONE LUUM.</h2><button onClick={()=>navigate('collection')} className="detail-action glass-control">다섯 가지 패턴 살펴보기 <span>↓</span></button></section>
            <aside className="chapter-rail" aria-label="제품 장면 탐색">{chapters.map((c,i)=><button key={c.title} onClick={()=>jump(i)} className={chapter===i?'active':''} aria-label={c.label} aria-current={chapter===i?'step':undefined}><span>{c.label}</span><i/></button>)}</aside>
            <nav className="product-selector" aria-label="제품 선택">{products.map((p,i)=><button key={p.id} onClick={()=>choose(i)} disabled={!ready} aria-label={`${p.name} ${p.ko} 보기`} aria-pressed={selected===i} className={`glass-control ${selected===i?'selected':''}`}><img src={asset(`models/luum-${p.id}.png`)} alt=""/><span>{p.name}</span><i/></button>)}</nav>
            <span className="sr-only" aria-live="polite">{product.name} {product.ko} {product.scentKo}</span>
          </div>
        </section>
        <PatternAtelier onInspect={inspect}/>
        <footer className="ending" id="ending"><div className="footer-pattern" aria-hidden="true"><Pattern type="diamond"/></div>
          <div className="footer-directory">
            <div className="footer-about"><h3 className="brand">LUUM</h3><p>Certainty, beyond sight.</p><a href="#exhibition-opening" onClick={e=>{e.preventDefault();navigate('exhibition-opening');}} className="back-to-top glass-control">Back to the beginning ↑</a></div>
            <nav aria-label="푸터 컬렉션"><h3>Collection</h3>{products.map((p,i)=><a key={p.id} href="#showcase" onClick={e=>{e.preventDefault();choose(i);}}>{p.name}</a>)}</nav>
            <nav aria-label="브랜드 링크"><h3>Connect</h3><a href="https://ysy6631y.github.io/LUUM/" target="_blank" rel="noreferrer">Brand website ↗</a><a href="https://www.instagram.com/luum/" target="_blank" rel="noreferrer">Instagram @luum ↗</a></nav>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} LUUM</span><span>Skincare, felt differently.</span></div>
        </footer>
      </main>
    </div>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
