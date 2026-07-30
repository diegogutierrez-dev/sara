"use client";

import { gsap, useGSAP } from "../lib/gsap";

const COUNT = 16;

/**
 * Partículas del diente de león (home): vaivén senoidal en el hijo y deriva
 * del viento en el padre, en loop infinito. Respeta prefers-reduced-motion.
 */
export function useDandelionParticles(rootRef) {
  useGSAP(() => {
    const root = rootRef.current;
    const particlesHost = root.querySelector(".particles");
    const stageEl = root.querySelector(".stage");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !particlesHost) return;

    const particleTls = [];
    for (let i = 0; i < COUNT; i++) {
      const seed = document.createElement("span");
      seed.className = "particle";
      const dot = document.createElement("span");
      dot.className = "particle__dot";
      const size = gsap.utils.random(2, 5);
      dot.style.width = dot.style.height = size + "px";
      seed.appendChild(dot);
      particlesHost.appendChild(seed);

      /* vaivén senoidal en el hijo; deriva del viento en el padre */
      gsap.to(dot, {
        x: gsap.utils.random(-26, 26),
        duration: gsap.utils.random(1.6, 3.2),
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      const float = () => {
        const w = stageEl.clientWidth || 1440;
        const h = stageEl.clientHeight || 900;
        const x0 = w * gsap.utils.random(0.45, 0.56);
        const y0 = h * gsap.utils.random(0.36, 0.56);
        const dur = gsap.utils.random(7, 14);
        const tl = gsap.timeline({ onComplete: float, delay: gsap.utils.random(0, 3) });
        tl.set(seed, { x: x0, y: y0, opacity: 0 })
          .to(seed, { opacity: gsap.utils.random(0.3, 0.85), duration: 1.4, ease: "power1.out" }, 0)
          .to(seed, {
            x: x0 + gsap.utils.random(140, w * 0.42),
            y: y0 - gsap.utils.random(90, h * 0.5),
            duration: dur,
            ease: "none",
          }, 0)
          .to(seed, { opacity: 0, duration: 1.6, ease: "power1.in" }, dur - 1.6);
        particleTls[i] = tl;
      };
      float();
    }

    return () => {
      particleTls.forEach((tl) => tl && tl.kill());
      gsap.killTweensOf(particlesHost.querySelectorAll(".particle, .particle__dot"));
      particlesHost.innerHTML = "";
    };
  }, { scope: rootRef });
}
