"use client";

import { useEffect } from "react";

/**
 * Overlay de desarrollo (?dbg): medidas del escenario, estilos computados de
 * los titulares y hit-test en coordenadas ?hx/?hy.
 */
export function useDebugOverlay(rootRef) {
  useEffect(() => {
    if (!new URLSearchParams(location.search).has("dbg")) return;
    const root = rootRef.current;
    const stageEl = root.querySelector(".stage");
    const isMobile = () => window.matchMedia("(max-width: 899px)").matches;

    const d = document.createElement("div");
    d.style.cssText =
      "position:fixed;left:0;bottom:0;background:#c00;color:#fff;font:11px monospace;z-index:999;white-space:pre;padding:4px";
    const cs = (sel) => {
      const el = root.querySelector(sel);
      const c = getComputedStyle(el);
      return `${sel} pos=${c.position} w=${c.width} ws=${c.whiteSpace} fs=${c.fontSize}`;
    };
    const qs = new URLSearchParams(location.search);
    const hx = parseInt(qs.get("hx") || "60", 10);
    const hy = parseInt(qs.get("hy") || "275", 10);
    const hit = document.elementFromPoint(hx, hy);
    d.textContent = [
      `stage=${stageEl.clientWidth} inner=${window.innerWidth} mob=${isMobile()}`,
      `hit(${hx},${hy})=${hit ? hit.className || hit.tagName : "none"}`,
      cs(".blurb"),
      cs(".flauta-heading"),
      cs(".name-heading"),
    ].join("\n");
    document.body.appendChild(d);

    return () => d.remove();
  }, [rootRef]);
}
