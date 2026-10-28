import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { content, asset } from "./content";
import { useExperience } from "./useExperience";
import "./styles.css";

function Lines({ lines }) {
  return lines.map((line) => (
    <span className="line" key={line}>
      <span className="line-inner">{line}</span>
    </span>
  ));
}
function Media({ src, alt, className = "", eager = false }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`media ${className}`}>
      {!failed && src ? (
        <img
          src={asset(src)}
          alt={alt}
          width="1200"
          height="1500"
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="media-fallback" role="img" aria-label={alt}>
          <span>LUUM</span>
          <small>Image placeholder</small>
        </div>
      )}
    </div>
  );
}
function App() {
  const root = useRef(null);
  const controls = useRef(null);
  const video = useRef(null);
  const [still, setStill] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  useExperience(root, controls, still);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const pause = () => {
      video.current?.pause();
      setPlaying(false);
    };
    const onPreference = () => {
      if (preference.matches) pause();
    };
    const onVisibility = () => {
      if (document.hidden) pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) pause();
      },
      { threshold: 0.01 },
    );
    if (video.current) observer.observe(video.current);
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  const toggleVideo = async () => {
    const element = video.current;
    if (!element) return;
    if (!element.paused) {
      element.pause();
    } else {
      try {
        await element.play();
      } catch (error) {
        // A quick second click intentionally interrupts pending playback.
        if (error.name !== "AbortError") setVideoError(true);
      }
    }
  };
  const jump = (index) => {
    if (controls.current) controls.current(index);
    else
      document
        .getElementById(`product-${content.products[index].id}`)
        ?.scrollIntoView({ behavior: "instant" });
  };
  return (
    <div ref={root} className="experience">
      <a className="skip-link" href="#story">
        본문으로 건너뛰기
      </a>
      <header className="site-header">
        <a className="wordmark" href="#opening" aria-label="LUUM 처음으로">
          LUUM
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#story">Our story</a>
          <a href="#products">The collection</a>
          <a href="#values">Our values</a>
        </nav>
        <a className="header-discover" href="#products">
          Discover LUUM <span aria-hidden="true">↗</span>
        </a>
      </header>
      <main>
        <section
          id="opening"
          className="opening"
          aria-labelledby="opening-title"
        >
          <div className="opening-media">
            <img
              src={asset(content.opening.poster)}
              alt=""
              width="1600"
              height="900"
              fetchPriority="high"
            />
            {content.opening.video && !videoError ? (
              <video
                ref={video}
                poster={asset(content.opening.poster)}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onError={() => setVideoError(true)}
              >
                {content.opening.videoWebm ? (
                  <source
                    src={asset(content.opening.videoWebm)}
                    type="video/webm"
                  />
                ) : null}
                <source src={asset(content.opening.video)} type="video/mp4" />
              </video>
            ) : null}
          </div>
          <div className="opening-title">
            <p>{content.opening.subtitle}</p>
            <h1 id="opening-title" className="hero-wordmark">
              LUUM
            </h1>
            <p className="opening-tagline">{content.opening.title}</p>
          </div>
          <div className="opening-bottom">
            <a href="#story" className="scroll-cue">
              <span className="scroll-line" aria-hidden="true" />
              Scroll to discover
            </a>
            <span className="film-label">A moment with LUUM</span>
            {content.opening.video ? (
              <button
                className="film-button"
                onClick={toggleVideo}
                disabled={videoError}
                aria-pressed={playing}
              >
                <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
                {videoError
                  ? "Film unavailable"
                  : playing
                    ? "Pause film"
                    : "Play film"}
              </button>
            ) : (
              <span>Brand film — coming soon</span>
            )}
          </div>
        </section>
        <section id="story" className="story" aria-labelledby="story-title">
          <div className="story-intro">
            <p className="section-label">Our story</p>
            <h2 id="story-title" className="story-heading">
              <Lines lines={content.story.title} />
            </h2>
          </div>
          <figure className="story-image">
            <Media src={content.story.image} alt={content.story.alt} />
            <figcaption>A quiet beginning.</figcaption>
          </figure>
          <div className="story-copy">
            <p className="korean-copy">{content.story.body}</p>
            <p className="english-note">
              An invitation to slow down.
              <br />
              To notice the light. To make room for yourself.
            </p>
            <a className="text-link" href="#products">
              Explore the collection <span aria-hidden="true">↓</span>
            </a>
          </div>
          <span className="story-side" aria-hidden="true">
            The art of everyday rituals
          </span>
        </section>
        <section
          className="collection-intro"
          aria-labelledby="collection-title"
        >
          <p className="section-label">The collection</p>
          <h2 id="collection-title">
            Five moments.
            <br />
            One quiet ritual.
          </h2>
          <p>당신의 하루를 따라, 다섯 가지의 감각.</p>
          <span className="intro-line" aria-hidden="true" />
        </section>
        <section
          id="products"
          className="products"
          aria-label="다섯 제품 컬렉션"
        >
          <div className="product-stage">
            <div className="collection-top">
              <span>LUUM collection</span>
              <a href="#values">
                Skip to our values <span aria-hidden="true">↓</span>
              </a>
            </div>
            {content.products.map((product) => (
              <article
                id={`product-${product.id}`}
                key={product.id}
                className={`product-scene layout-${product.layout}`}
                style={{
                  "--scene-bg": product.color,
                  "--scene-ink": product.ink,
                }}
                aria-labelledby={`title-${product.id}`}
              >
                <div className="product-copy">
                  <p className="product-number">PRODUCT {product.id}</p>
                  <h2 id={`title-${product.id}`}>{product.title}</h2>
                  <p className="product-line">{product.line}</p>
                  <p className="product-description">{product.description}</p>
                </div>
                <figure className="product-image">
                  <Media
                    src={product.image}
                    alt={`PRODUCT ${product.id} — 제품 이미지 플레이스홀더`}
                    eager
                  />
                  <figcaption>
                    PRODUCT {product.id} <span>Image placeholder</span>
                  </figcaption>
                </figure>
              </article>
            ))}
            <div className="chapter-nav">
              <div className="chapter-count">
                <span className="chapter-current">01</span>
                <span className="chapter-divider" />
                05
              </div>
              <nav aria-label="제품 바로가기">
                {content.products.map((p, i) => (
                  <button
                    key={p.id}
                    className="chapter-button"
                    onClick={() => jump(i)}
                    aria-label={`PRODUCT ${p.id} 보기`}
                    aria-current={i === 0 ? "step" : undefined}
                  >
                    <span>{p.id}</span>
                  </button>
                ))}
              </nav>
              <button
                className="motion-toggle"
                aria-pressed={still}
                onClick={() => {
                  setStill(!still);
                }}
              >
                {still ? "스크롤 연출 켜기" : "모든 제품 펼쳐보기"}
              </button>
              <div className="chapter-track" aria-hidden="true">
                <span className="chapter-progress" />
              </div>
            </div>
          </div>
        </section>
        <section id="values" className="values" aria-labelledby="values-title">
          <div className="values-title-block">
            <p className="section-label">Our values</p>
            <h2 id="values-title" className="values-heading">
              <Lines lines={content.values.title} />
            </h2>
            <p className="values-summary">많은 것보다, 마음에 남는 것.</p>
          </div>
          <figure className="values-image">
            <Media
              src={content.values.image}
              alt="LUUM의 빛과 여백을 표현한 패브릭 무드 이미지"
            />
          </figure>
          <div className="value-list">
            {content.values.items.map((v) => (
              <article className="value-item" key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <p>
            Make room
            <br />
            <span>for a little light.</span>
          </p>
          <a href="#opening">
            Back to the beginning <span aria-hidden="true">↑</span>
          </a>
        </div>
        <a
          className="footer-wordmark"
          href="#opening"
          aria-label="LUUM 처음으로"
        >
          LUUM
        </a>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} LUUM</span>
          <span>Light up your routine.</span>
          <span className="preview-note">Collection preview</span>
        </div>
      </footer>
    </div>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
