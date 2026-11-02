import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import { products, chapters, asset } from './content';
import './styles.css';
gsap.registerPlugin(ScrollTrigger);

function Arrow({ direction = 'down' }) { return <svg viewBox="0 0 24 24" aria-hidden="true" className={`arrow arrow-${direction}`}><path d="M12 4v15M6 13l6 6 6-6" /></svg>; }
function CollectionIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="6" cy="6" r="2.3"/><circle cx="14" cy="6" r="2.3"/><circle cx="6" cy="14" r="2.3"/><circle cx="14" cy="14" r="2.3"/></svg>; }

function App() {
  const canvas = useRef(null), controller = useRef(null), app = useRef(null), galleryButton = useRef(null), closeButton = useRef(null);
  const [selected, setSelected] = useState(3);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [motion, setMotion] = useState(false);
  const product = products[selected];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectRef = useRef(null);

  const jump = (index) => {
    const y = (document.documentElement.scrollHeight - innerHeight) * index / 3;
    window.scrollTo({ top: y, behavior: reduced() ? 'instant' : 'smooth' });
  };
  const choose = (index, close = true) => {
    if (!ready) return;
    controller.current?.select(index);
    setSelected(index);
    gsap.to(app.current, { '--scene-bg': products[index].bg, '--ink': products[index].ink, duration: reduced() ? .01 : 1.4, ease: 'power2.inOut', overwrite: 'auto' });
    if (close && gallery) { setGallery(false); jump(0); }
  };
  selectRef.current = choose;

  useEffect(() => {
    let disposed = false;
    import('./scene').then(({ ProductScene }) => {
      if (disposed) return;
      try {
        controller.current = new ProductScene(canvas.current, {
          onProgress: n => !disposed && setProgress(n),
          onReady: () => !disposed && setReady(true),
          onError: () => { if (!disposed) { controller.current?.dispose(); setFallback(true); setReady(true); setProgress(100); } },
          onPick: i => selectRef.current(i),
        });
      } catch { setFallback(true); setReady(true); setProgress(100); }
    }).catch(() => { if (!disposed) { setFallback(true); setReady(true); setProgress(100); } });
    return () => { disposed = true; controller.current?.dispose(); };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('locked', !entered || gallery);
    controller.current?.setGallery(gallery);
    if (gallery) closeButton.current?.focus();
    const onKey = e => {
      if (e.key === 'Escape' && gallery) { setGallery(false); galleryButton.current?.focus(); }
      if (gallery && e.key === 'Tab') {
        const nodes = [...document.querySelectorAll('.collection-view button')];
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { last?.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first?.focus(); e.preventDefault(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('locked'); window.removeEventListener('keydown', onKey); };
  }, [entered, gallery]);

  useEffect(() => {
    if (!entered) return;
    const context = gsap.context(() => {
      gsap.set('.story-layer:not(.hero-copy)', { autoAlpha: 0, y: 24 });
      const tl = gsap.timeline({ scrollTrigger: {
        trigger: '.scroll-track', start: 'top top', end: 'bottom bottom', scrub: reduced() ? false : .7,
        onUpdate: s => setChapter(previous => { const next = Math.min(3, Math.round(s.progress*3)); return previous === next ? previous : next; }),
      }});
      tl.to({}, { duration: 3 }, 0)
        .to('.hero-copy', { autoAlpha: 0, y: -22, duration: .4 }, .2)
        .to('.detail-copy', { autoAlpha: 1, y: 0, duration: .35 }, .65)
        .to('.detail-copy', { autoAlpha: 0, y: -24, duration: .3 }, 1.25)
        .to('.ring-copy', { autoAlpha: 1, y: 0, duration: .35 }, 1.65)
        .to('.ring-copy', { autoAlpha: 0, y: -24, duration: .3 }, 2.28)
        .to('.ritual-copy', { autoAlpha: 1, y: 0, duration: .35 }, 2.65);
    }, app);
    return () => context.revert();
  }, [entered, motion]);

  const enter = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setEntered(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  const toggleMotion = () => {
    const value = !motion; setMotion(value);
    if (controller.current) controller.current.reduced = value || reduced();
  };

  return <div ref={app} data-chapter={chapter} className={`experience ${entered ? 'is-entered' : ''} ${gallery ? 'is-gallery' : ''} ${fallback ? 'is-fallback' : ''}`} style={{ '--scene-bg': products[3].bg, '--ink': products[3].ink }}>
    <a className="skip-link" href="#object-description">제품 설명으로 건너뛰기</a>
    <div className="light-field" aria-hidden="true"><i/><i/><i/></div>
    <canvas ref={canvas} className="product-canvas" aria-label={`LUUM ${product.name} 실제 3D 제품. 드래그하여 회전하고 스크롤하여 디테일을 탐색하세요.`} />
    {fallback && <div className="fallback-stage" aria-label="제품 이미지로 탐색"><img src={asset(`models/luum-${product.id}.png`)} alt={`LUUM ${product.name} 원본 모델 렌더링`} /><p>제품 이미지로 감상 중입니다</p></div>}

    <div className={`opening ${entered ? 'opening-out' : ''}`} aria-hidden={entered}>
      <div className="opening-brand brand">LUUM</div>
      <div className="opening-center">
        <span className="opening-kicker">Light up your routine.</span>
        <h1 className="brand">THE SHAPE<br/>OF STILLNESS</h1>
        <p>빛이 머무는 형태, LUUM</p>
        <div className="loading-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="3D 컬렉션 로딩"><span style={{ transform: `scaleX(${progress/100})` }} /></div>
        <button className="enter-button" onClick={enter} disabled={!ready} tabIndex={entered ? -1 : 0}>{ready ? '컬렉션 감상하기' : '빛을 준비하고 있습니다'}<span>{ready ? <Arrow direction="right"/> : `${String(progress).padStart(2,'0')}%`}</span></button>
      </div>
      <p className="opening-foot">A study in stone, gold and quiet light.</p>
    </div>

    <div className="main-interface" inert={!entered || gallery ? true : undefined}>
      <header className="site-header">
        <button ref={galleryButton} className="collection-trigger" onClick={() => setGallery(true)} aria-haspopup="dialog"><CollectionIcon/><span>컬렉션</span></button>
        <a href="#" className="wordmark brand" aria-label="LUUM 처음으로" onClick={e => { e.preventDefault(); jump(0); }}>LUUM</a>
        <span className="header-note">Light up your routine.</span>
      </header>
      <main className="scroll-track" aria-label="LUUM 제품과 디테일 탐색">
        <div className="content-layers">
          <section className="story-layer hero-copy" id="object-description" aria-label="선택한 제품">
            <p className="collection-label">The LUUM collection</p>
            <h2 className="product-title brand" key={product.id}>{product.name}</h2>
            <p className="product-subtitle">{product.tone}</p>
            <button className="scroll-discover" onClick={() => jump(1)}><span>Scroll to discover</span><span className="circle-arrow"><Arrow/></span></button>
          </section>
          <section className="story-layer detail-copy" aria-label="금빛 기하학 패턴">
            <span className="chapter-label">The golden geometry</span>
            <h2 className="brand">STONE<br/>MEETS LIGHT</h2>
            <p>스톤 위에 새겨진 금빛의 질서.<br/>서로 다른 선과 면이 만드는<br/>다섯 가지의 고요한 표정.</p>
            <span className="detail-note">{product.name} — {product.ko}</span>
          </section>
          <section className="story-layer ring-copy" aria-label="상단 링 디테일">
            <span className="chapter-label">The finishing touch</span>
            <h2 className="brand">A TRACE<br/>OF GOLD</h2>
            <p>무광의 표면을 따라 흐르는 빛.<br/>섬세한 금색 링과 장식에서<br/>LUUM의 형태가 완성됩니다.</p>
            <span className="detail-note">드래그하여 다른 각도에서 감상하세요</span>
          </section>
          <section className="story-layer ritual-copy" aria-label="제품 소개">
            <span className="chapter-label">The quiet ritual</span>
            <h2 className="brand">A MOMENT<br/>WITH LUUM</h2>
            <p className="product-description">{product.description}</p>
            <button className="text-action" onClick={() => { choose((selected + 1) % 5, false); jump(0); }}>다음 오브제 감상하기 <Arrow direction="right"/></button>
            <button className="subtle-action" onClick={() => setGallery(true)}>다섯 가지 오브제 모두 보기</button>
          </section>
        </div>
      </main>
      <aside className="chapter-rail" aria-label="장면 탐색">
        {chapters.map((c,i) => <button key={c.title} onClick={() => jump(i)} className={chapter === i ? 'active' : ''} aria-label={c.label} aria-current={chapter === i ? 'step' : undefined}><span>{c.label}</span><i/></button>)}
      </aside>
      <footer className="stage-footer">
        <div className="object-caption" aria-live="polite"><span className="object-count">{product.id}<i/>05</span><span className="caption-name">{product.ko}</span></div>
        <nav className="product-selector" aria-label="제품 선택">
          {products.map((p,i) => <button key={p.id} onClick={() => choose(i, false)} aria-label={`${p.name} ${p.ko} 보기`} aria-pressed={selected === i} className={selected === i ? 'selected' : ''}><img src={asset(`models/luum-${p.id}.png`)} alt=""/><span className="selector-name">{p.name}</span><i/></button>)}
        </nav>
        <div className="interaction-tools"><span>Drag to rotate</span><button className="motion-control" title={motion ? '부드러운 모션 켜기' : '모션 줄이기'} aria-pressed={motion} onClick={toggleMotion} aria-label={motion ? '부드러운 모션 켜기' : '모션 줄이기'}><span className="motion-lines" aria-hidden="true">{motion ? 'Ⅱ' : '≈'}</span></button></div>
      </footer>
    </div>

    {gallery && <div className="collection-view" role="dialog" aria-modal="true" aria-label="LUUM 다섯 가지 오브제 컬렉션">
      <div className="collection-header"><span>LUUM collection</span><span className="brand">LUUM</span><button ref={closeButton} onClick={() => { setGallery(false); galleryButton.current?.focus(); }} className="close-button" aria-label="컬렉션 닫기"><span/><span/></button></div>
      {fallback && <div className="gallery-fallbacks">{products.map(p => <img key={p.id} src={asset(`models/luum-${p.id}.png`)} alt=""/>)}</div>}
      <div className="gallery-labels">{products.map((p,i) => <button key={p.id} onClick={() => choose(i)} aria-label={`${p.name} 탐색`} className={i === selected ? 'current' : ''}><span className="gallery-number">{p.id}</span><span>{p.name}</span><i/></button>)}</div>
      <div className="collection-heading"><p>당신의 감각이 머무는 오브제를 선택하세요</p><h2 className="brand">FIVE FORMS<br/>ONE RITUAL</h2></div>
      <p className="collection-foot">Stone. Gold. A quiet radiance.</p>
    </div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
