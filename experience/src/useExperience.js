import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionSpec as spec, sceneAt, sceneProgress } from "./motionSpec";
gsap.registerPlugin(ScrollTrigger);

export function useExperience(root, controls, still) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const scope = root.current;
    const q = gsap.utils.selector(scope);
    mm.add(
      {
        desktop: "(min-width: 769px)",
        mobile: "(max-width: 768px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      ({ conditions }) => {
        if (conditions.reduce || still) {
          scope.classList.remove("motion-enabled");
          controls.current = null;
          return;
        }
        const mobile = conditions.mobile;
        scope.classList.add("motion-enabled");
        const scenes = q(".product-scene");
        const dots = q(".chapter-button");
        const counter = q(".chapter-current")[0];
        let active = -1;
        const setActive = (index) => {
          if (index === active) return;
          active = index;
          scenes.forEach((scene, i) => {
            scene.setAttribute("aria-hidden", String(i !== index));
            scene.inert = i !== index;
          });
          dots.forEach((dot, i) => {
            dot.setAttribute("aria-current", i === index ? "step" : "false");
          });
          counter.textContent = String(index + 1).padStart(2, "0");
        };
        setActive(0);
        gsap.from(q(".opening-title"), {
          autoAlpha: 0,
          y: 16,
          duration: 1.1,
          ease: "power2.out",
        });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: q(".opening")[0],
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
          .to(
            q(".opening-media"),
            { yPercent: 18, scale: 1.07, ease: "none" },
            0,
          )
          .to(
            q(".opening-title"),
            { yPercent: -22, opacity: 0, ease: "none" },
            0,
          );
        gsap.fromTo(
          q(".story-image"),
          { clipPath: "inset(12% 10% 12% 10%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: q(".story")[0],
              start: "top 75%",
              end: "center 60%",
              scrub: 0.6,
            },
          },
        );
        gsap.fromTo(
          q(".story-image img"),
          { scale: 1.16, yPercent: -5 },
          {
            scale: 1,
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: q(".story")[0],
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        gsap.from(q(".story-heading .line-inner"), {
          yPercent: 110,
          stagger: 0.15,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: q(".story-heading")[0],
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from(q(".story-copy"), {
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: q(".story-copy")[0],
            start: "top 83%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.set(scenes.slice(1), { autoAlpha: 0 });
        const total = scenes.length * spec.sceneDuration;
        const timeline = gsap.timeline({
          defaults: { ease: "sine.inOut" },
          scrollTrigger: {
            id: "luum-products",
            trigger: q(".products")[0],
            pin: q(".product-stage")[0],
            start: "top top",
            end: () =>
              `+=${window.innerHeight * scenes.length * (mobile ? spec.mobileDistance : spec.desktopDistance)}`,
            scrub: mobile ? spec.mobileScrub : spec.scrub,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          onUpdate() {
            setActive(sceneAt(this.progress(), scenes.length));
          },
        });
        // A continuous master timeline keeps rapid/reverse scroll deterministic.
        scenes.forEach((scene, i) => {
          const at = i * spec.sceneDuration;
          timeline.to(
            q(".collection-top"),
            {
              color: scene.style.getPropertyValue("--scene-ink"),
              duration: spec.transition,
            },
            at,
          );
          const media = scene.querySelector(".product-image");
          const copy = scene.querySelectorAll(".product-copy > *");
          if (i > 0) {
            timeline.fromTo(
              scene,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: spec.transition },
              at,
            );
            timeline.to(
              scenes[i - 1],
              { autoAlpha: 0, duration: spec.transition },
              at + 0.12,
            );
            timeline.fromTo(
              media,
              { clipPath: "inset(8% 10% 8% 10%)", scale: 0.88, yPercent: 9 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                yPercent: 0,
                duration: 1.2,
              },
              at,
            );
          }
          timeline.fromTo(
            copy,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 },
            at + spec.textDelay,
          );
          timeline.to(
            media,
            {
              scale: i === 2 ? 1.08 : 1.04,
              xPercent: mobile ? 0 : i % 2 ? 2 : -2,
              duration: 1.3,
              ease: "none",
            },
            at + 1.3,
          );
        });
        timeline.to({}, { duration: 0.01 }, total);
        timeline.fromTo(
          q(".chapter-progress"),
          { scaleX: 0 },
          { scaleX: 1, duration: total, ease: "none" },
          0,
        );
        controls.current = (index) => {
          const trigger = timeline.scrollTrigger;
          window.scrollTo({
            top:
              trigger.start +
              (trigger.end - trigger.start) *
                sceneProgress(index, scenes.length),
            behavior: "instant",
          });
        };
        gsap.from(q(".values-heading .line-inner"), {
          yPercent: 105,
          stagger: 0.18,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: q(".values-heading")[0],
            start: "top 83%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.fromTo(
          q(".values-image img"),
          { yPercent: -7, scale: 1.15 },
          {
            yPercent: 7,
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: q(".values-image")[0],
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        q(".value-item").forEach((item) =>
          gsap.from(item, {
            opacity: 0.25,
            duration: 0.7,
            scrollTrigger: {
              trigger: item,
              start: "top 86%",
              toggleActions: "play none none reverse",
            },
          }),
        );
        ScrollTrigger.refresh();
        return () => {
          controls.current = null;
          scope.classList.remove("motion-enabled");
          scenes.forEach((scene) => {
            scene.removeAttribute("aria-hidden");
            scene.inert = false;
          });
        };
      },
      scope,
    );
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      mm.revert();
    };
  }, [root, controls, still]);
}
