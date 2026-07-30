"use client";

import { gsap, Flip, useGSAP } from "../lib/gsap";
import { ENSEMBLE_SLUGS } from "../data/ensembles";
import { TRAY_CATS } from "../data/trayectoria";

/* Elementos que participan del morph entre estados del prototipo */
const FLIP_TARGETS = [
  ".topnav", ".ensnav", ".hero-img", ".hero-img__slide",
  ".name-heading", ".flauta-heading", ".blurb", ".more-arrow", ".back-arrow",
  ".logo-row", ".videos-strip",
  ".contact-photo", ".contact-title", ".contact-block",
  ".bio-full__photo", ".bio-full__title", ".bio-full__cols",
  ".ens-symbol", ".ens-title", ".ens-tabs",
].join(",");

/* Detalles de entrada por vista (hijos que Flip no cubre), con stagger */
const ENTER_FX = {
  "ens-detail": [".ens-content.is-active .ens-col > *", { y: 26, delay: 0.35 }],
  "bio-full": [".bio-full__col p", { y: 26, delay: 0.3 }],
  videos: [".video-card", { y: 56, delay: 0.1 }],
  contacto: [".contact-block__emails a, .contact-block__signature-box", { y: 20, delay: 0.3 }],
  ensambles: [".logo__wordmark", { y: 16, delay: 0.3 }],
  trayectoria: [".tray-menu a, .tray-group.is-current .tray-entry", { y: 24, delay: 0.2 }],
};

/**
 * Router por hash + transiciones de estado con GSAP Flip + intro del home.
 * Muta data-view / data-ens / data-tab / data-traycat en la raíz; el CSS
 * posiciona cada vista según esos atributos y Flip anima la diferencia.
 */
export function useViewRouter(rootRef, setTrayCat) {
  useGSAP(() => {
    const root = rootRef.current;
    const q = (sel) => gsap.utils.toArray(sel, root);
    const stageEl = root.querySelector(".stage");
    const backArrow = root.querySelector(".back-arrow");
    const isMobile = () => window.matchMedia("(max-width: 899px)").matches;
    let activeFlip = null;
    let intro = null;

    /* ---------- Contenido de ensamble activo ---------- */
    const updateEnsContent = () => {
      const ens = root.dataset.ens;
      const tab = ens === "otros" ? "perfil" : root.dataset.tab;
      q(".ens-content").forEach((el) => {
        const matchTab = el.dataset.tabContent === tab;
        const matchEns = !el.dataset.ensContent || el.dataset.ensContent === ens;
        el.classList.toggle(
          "is-active",
          root.dataset.view === "ens-detail" && matchTab && matchEns
        );
      });
    };

    /* ---------- Transición de estado con GSAP Flip ---------- */
    const enterFx = (view) => {
      const fx = ENTER_FX[view];
      if (!fx) return;
      const els = q(fx[0]);
      if (!els.length) return;
      gsap.from(els, {
        y: fx[1].y,
        autoAlpha: 0,
        duration: 0.9,
        delay: fx[1].delay,
        stagger: 0.06,
        ease: "power3.out",
        overwrite: true,
        clearProps: "transform,opacity,visibility",
      });
    };

    const applyState = (mutate, animate) => {
      if (intro && intro.isActive()) intro.progress(1);
      if (!animate) {
        mutate();
        return;
      }
      /* En móvil no hay morphs: fundido simple + entradas escalonadas */
      if (isMobile()) {
        mutate();
        window.scrollTo(0, 0);
        gsap.fromTo(
          stageEl,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5, ease: "power1.out", clearProps: "opacity,visibility" }
        );
        enterFx(root.dataset.view);
        return;
      }
      const targets = q(FLIP_TARGETS);
      if (activeFlip) activeFlip.kill();
      const state = Flip.getState(targets, { props: "opacity,fontSize" });
      const prevContent = root.querySelector(".ens-content.is-active");
      mutate();
      const nextContent = root.querySelector(".ens-content.is-active");
      activeFlip = Flip.from(state, {
        duration: 1,
        ease: "power3.inOut",
        nested: true,
        prune: true,
        onComplete: () => {
          /* Sin residuos inline: Flip deja width/height/transform que
             desubican los elementos en el siguiente estado. */
          gsap.set(targets, { clearProps: "all" });
          activeFlip = null;
        },
      });
      /* Push direccional del contenido de ensamble: el saliente se va a la
         izquierda mientras el entrante llega desde la derecha. */
      if (nextContent !== prevContent) {
        if (prevContent) {
          gsap.fromTo(prevContent,
            { x: 0, autoAlpha: 1 },
            { x: -80, autoAlpha: 0, duration: 0.6, ease: "power2.in",
              overwrite: true, clearProps: "transform,opacity,visibility" });
        }
        if (nextContent) {
          gsap.fromTo(nextContent,
            { x: 120, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.9, delay: prevContent ? 0.25 : 0.15,
              ease: "power3.out", overwrite: true,
              clearProps: "transform,opacity,visibility" });
        }
      }
      enterFx(root.dataset.view);
    };

    /* ---------- Router por hash ---------- */
    const route = (animate) => {
      root.classList.remove("menu-open");
      const hash = location.hash.replace(/^#\/?/, "");
      const parts = hash.split("/").filter(Boolean);
      let view = "home";
      let ens = root.dataset.ens;
      let tab = root.dataset.tab;
      let trayCat = root.dataset.traycat || "orquestas";

      if (parts[0] === "biografia") {
        view = parts[1] === "completa" ? "bio-full" : "bio";
      } else if (parts[0] === "ensambles") {
        if (ENSEMBLE_SLUGS.includes(parts[1])) {
          view = "ens-detail";
          ens = parts[1];
          tab = parts[2] === "videos" && parts[1] !== "otros" ? "videos" : "perfil";
        } else {
          view = "ensambles";
        }
      } else if (parts[0] === "trayectoria") {
        view = "trayectoria";
        trayCat = TRAY_CATS.includes(parts[1]) ? parts[1] : "orquestas";
      } else if (["videos", "contacto"].includes(parts[0])) {
        view = parts[0];
      }

      /* Cambio de categoría dentro de trayectoria: solo desliza el strip */
      if (
        animate &&
        view === "trayectoria" &&
        root.dataset.view === "trayectoria" &&
        trayCat !== root.dataset.traycat
      ) {
        root.dataset.traycat = trayCat;
        setTrayCat(trayCat, true);
        return;
      }

      applyState(() => {
        root.dataset.view = view;
        root.dataset.ens = ens;
        root.dataset.tab = tab;
        if (view === "trayectoria") {
          root.dataset.traycat = trayCat;
          setTrayCat(trayCat, false);
        }
        backArrow.setAttribute("href", view === "bio-full" ? "#/biografia" : "#/ensambles");
        updateEnsContent();
      }, animate);
    };

    const onHashChange = () => route(true);

    /* ---------- Estado inicial e intro ---------- */
    route(false);

    const skipIntro =
      new URLSearchParams(location.search).has("nointro") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (root.dataset.view === "home" && !skipIntro) {
      const introEls = [".topnav", ".hero-img", ".name-heading", ".flauta-heading"];
      intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => gsap.set(introEls.map((s) => root.querySelector(s)), { clearProps: "all" }),
      });
      intro
        .from(root.querySelector(".hero-img"), { autoAlpha: 0, scale: 0.985, duration: 1.3 }, 0.1)
        .from(root.querySelector(".name-heading"), { y: 60, autoAlpha: 0, duration: 1.1 }, 0.3)
        .from(root.querySelector(".flauta-heading"), { y: 40, autoAlpha: 0, duration: 1.0 }, 0.45)
        .from(root.querySelector(".topnav"), { y: -16, autoAlpha: 0, duration: 0.8 }, 0.55);
    }

    window.addEventListener("hashchange", onHashChange);

    /* ?goto=%23/ruta — navega tras 1.2s, para probar transiciones */
    const gotoParam = new URLSearchParams(location.search).get("goto");
    const gotoTimer = gotoParam ? setTimeout(() => (location.hash = gotoParam), 1200) : 0;

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      clearTimeout(gotoTimer);
      if (activeFlip) activeFlip.kill();
      if (intro) intro.kill();
    };
  }, { scope: rootRef });
}
