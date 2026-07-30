"use client";

import { useCallback, useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { TRAY_OFFSETS } from "../data/trayectoria";

const trayXFor = (root, cat) => {
  const w = root.querySelector(".tray-viewport").clientWidth || 1342;
  return (cat === "academia" || cat === "otros" ? w - 660 : w - 320) - TRAY_OFFSETS[cat];
};

/**
 * Trayectoria: posiciona el strip por categoría y anima el cambio entre
 * grupos. Devuelve `setTrayCat(cat, animate)` para que el router lo invoque.
 */
export function useTrayectoria(rootRef) {
  const tlRef = useRef(null);

  const setTrayCat = useCallback((cat, animate) => {
    const root = rootRef.current;
    const trayStrip = root.querySelector(".tray-strip");
    const groups = gsap.utils.toArray(".tray-group", root);
    gsap.utils.toArray(".tray-menu a", root).forEach((b) =>
      b.classList.toggle("is-active", b.dataset.cat === cat)
    );
    groups.forEach((g) => g.classList.toggle("is-current", g.dataset.cat === cat));

    if (!animate) {
      gsap.set(trayStrip, { x: trayXFor(root, cat) });
      groups.forEach((g) =>
        gsap.set(g, { autoAlpha: g.dataset.cat === cat ? 1 : 0 })
      );
      gsap.set(gsap.utils.toArray(".tray-entry", root), { clearProps: "transform,opacity,visibility" });
      return;
    }

    /* Cambio vertical: lo anterior se desvanece subiendo, el strip se
       reposiciona en seco (invisible) y las entradas nuevas suben en cascada.
       Sin overwrite en el timeline: mataría sus propios pasos al crearse. */
    const target = groups.find((g) => g.dataset.cat === cat);
    const others = groups.filter((g) => g !== target);
    const entries = target.querySelectorAll(".tray-entry");
    if (tlRef.current) tlRef.current.kill();
    gsap.killTweensOf([trayStrip, ...groups, ...entries]);
    tlRef.current = gsap.timeline();
    tlRef.current
      .to(others, { autoAlpha: 0, y: -20, duration: 0.35, ease: "power2.in" })
      .set(others, { y: 0 })
      .set(trayStrip, { x: trayXFor(root, cat) })
      .set(entries, { autoAlpha: 0, y: 34 })
      .set(target, { autoAlpha: 1 })
      .to(entries, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      }, "+=0.05");
  }, [rootRef]);

  /* Reposiciona el strip al redimensionar (desktop) */
  useGSAP(() => {
    const root = rootRef.current;
    const trayStrip = root.querySelector(".tray-strip");
    const onResize = () => {
      if (window.matchMedia("(max-width: 899px)").matches) return;
      gsap.set(trayStrip, { x: trayXFor(root, root.dataset.traycat || "orquestas") });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (tlRef.current) tlRef.current.kill();
    };
  }, { scope: rootRef });

  return setTrayCat;
}
