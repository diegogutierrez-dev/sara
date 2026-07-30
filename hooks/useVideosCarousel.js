"use client";

import { gsap, useGSAP } from "../lib/gsap";

const GAP = 21; /* acoplado al gap de .videos-strip__track en styles/videos.css */

/**
 * Carrusel de videos en desktop: arrastre con pointer capture, rueda con
 * candado antirrebote y flechas del teclado. En móvil manda el scroll nativo.
 */
export function useVideosCarousel(rootRef) {
  useGSAP(() => {
    const root = rootRef.current;
    const stageEl = root.querySelector(".stage");
    const strip = root.querySelector(".videos-strip");
    const track = root.querySelector(".videos-strip__track");
    const isMobile = () => window.matchMedia("(max-width: 899px)").matches;

    const N = track.children.length;
    let idx = 3;
    let dragging = false, startX = 0, startTx = 0;
    const cardW = () => track.children[0].getBoundingClientRect().width || 660;
    const txFor = (i) => stageEl.clientWidth / 2 - (i * (cardW() + GAP) + cardW() / 2);

    const snapTo = (i, immediate) => {
      if (isMobile()) return;
      idx = Math.max(0, Math.min(N - 1, i));
      if (immediate) gsap.set(track, { x: txFor(idx) });
      else gsap.to(track, { x: txFor(idx), duration: 0.8, ease: "power3.out" });
    };
    snapTo(idx, true);

    const onPointerDown = (e) => {
      if (isMobile()) return;
      dragging = true;
      startX = e.clientX;
      startTx = gsap.getProperty(track, "x");
      gsap.killTweensOf(track);
      track.classList.add("is-dragging");
      track.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      gsap.set(track, { x: startTx + (e.clientX - startX) });
    };
    const onPointerUp = (e) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      const moved = e.clientX - startX;
      const delta = Math.round(-moved / (cardW() + GAP));
      snapTo(idx + (delta === 0 && Math.abs(moved) > 80 ? (moved < 0 ? 1 : -1) : delta));
    };

    let wheelLock = false;
    const onWheel = (e) => {
      if (root.dataset.view !== "videos" || isMobile()) return;
      e.preventDefault();
      if (wheelLock) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) < 8) return;
      wheelLock = true;
      snapTo(idx + (d > 0 ? 1 : -1));
      setTimeout(() => (wheelLock = false), 450);
    };
    const onKeyDown = (e) => {
      if (root.dataset.view !== "videos") return;
      if (e.key === "ArrowRight") snapTo(idx + 1);
      if (e.key === "ArrowLeft") snapTo(idx - 1);
    };
    const onResize = () => {
      if (isMobile()) return;
      gsap.set(track, { x: txFor(idx) });
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    strip.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      strip.removeEventListener("wheel", onWheel);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      gsap.killTweensOf(track);
    };
  }, { scope: rootRef });
}
