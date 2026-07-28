"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

const ENSEMBLES = ["nomadas", "entrecuerdas", "otros"];

/* Elementos que participan del morph entre estados del prototipo */
const FLIP_TARGETS = [
  ".topnav", ".ensnav", ".hero-img", ".hero-img__slide",
  ".name-heading", ".flauta-heading", ".blurb", ".more-arrow", ".back-arrow",
  ".logo-row", ".videos-strip",
  ".contact-photo", ".contact-title", ".contact-block",
  ".bio-full__photo", ".bio-full__title", ".bio-full__cols",
  ".ens-symbol", ".ens-title", ".ens-tabs",
].join(",");

export default function Home() {
  const rootRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(Flip);
    const root = rootRef.current;
    const q = (sel) => gsap.utils.toArray(sel, root);
    const backArrow = root.querySelector(".back-arrow");
    const strip = root.querySelector(".videos-strip");
    const track = root.querySelector(".videos-strip__track");
    let activeFlip = null;
    let intro = null;

    /* ---------- Medidas responsivas ---------- */
    const isMobile = () => window.matchMedia("(max-width: 899px)").matches;
    const stageEl = root.querySelector(".stage");

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

    /* ---------- Símbolos de ensamble: SVG inline + dibujo de trazo ---------- */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const symbolReady = {};
    q(".ens-symbol [data-symbol]").forEach((host) => {
      const name = host.dataset.symbol;
      symbolReady[name] = fetch(`/assets/svg/symbol-${name}-big.svg`)
        .then((r) => r.text())
        .then((txt) => {
          /* pathLength=1 normaliza todos los trazos para animar el dashoffset */
          host.innerHTML = txt.replace(
            /<(path|circle|ellipse|line)\b/g,
            '<$1 pathLength="1"'
          );
          gsap.set(host.querySelectorAll("[pathLength]"), {
            strokeDasharray: 1.001,
            strokeDashoffset: 0,
          });
        })
        .catch(() => {});
    });
    /* Logos de la vista ensambles: mismo tratamiento de dibujo */
    const logoReady = [];
    q(".logo__symbol[data-logo]").forEach((host) => {
      logoReady.push(
        fetch(`/assets/svg/logo-${host.dataset.logo}.svg`)
          .then((r) => r.text())
          .then((txt) => {
            host.innerHTML = txt.replace(
              /<(path|circle|ellipse|line)\b/g,
              '<$1 pathLength="1"'
            );
            gsap.set(host.querySelectorAll("[pathLength]"), {
              strokeDasharray: 1.001,
              strokeDashoffset: 0,
            });
          })
          .catch(() => {})
      );
    });
    const drawLogos = () => {
      if (reduceMotion) return;
      Promise.all(logoReady).then(() => {
        const paths = q(".logo__symbol[data-logo] [pathLength]");
        if (!paths.length) return;
        gsap.fromTo(
          paths,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.5,
            stagger: 0.05,
            ease: "power2.inOut",
            overwrite: true,
          }
        );
        /* los rellenos (llaves de la flauta) aparecen mientras se dibuja */
        gsap.fromTo(
          q(".logo__symbol[data-logo] ellipse, .logo__symbol[data-logo] circle"),
          { fillOpacity: 0 },
          { fillOpacity: 1, duration: 1.1, delay: 0.6, ease: "power2.out", overwrite: true }
        );
      });
    };

    const drawSymbol = (ens) => {
      if (reduceMotion) return;
      (symbolReady[ens] || Promise.resolve()).then(() => {
        const host = root.querySelector(`.ens-symbol [data-symbol="${ens}"]`);
        const paths = host ? host.querySelectorAll("[pathLength]") : [];
        if (!paths.length) return;
        gsap.fromTo(
          paths,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.8,
            stagger: 0.07,
            ease: "power2.inOut",
            overwrite: true,
          }
        );
        gsap.fromTo(
          host.querySelectorAll("ellipse, circle"),
          { fillOpacity: 0 },
          { fillOpacity: 1, duration: 1.2, delay: 0.7, ease: "power2.out", overwrite: true }
        );
      });
    };

    /* ---------- Transición de estado con GSAP Flip ---------- */
    const enterFx = (view) => {
      /* Detalles de entrada (hijos que Flip no cubre), con stagger */
      const fx = {
        "ens-detail": [".ens-content.is-active .ens-col > *", { y: 26, delay: 0.35 }],
        "bio-full": [".bio-full__col p", { y: 26, delay: 0.3 }],
        videos: [".video-card", { y: 56, delay: 0.1 }],
        contacto: [".contact-block__emails a, .contact-block__signature-box", { y: 20, delay: 0.3 }],
        ensambles: [".logo__wordmark", { y: 16, delay: 0.3 }],
        trayectoria: [".tray-menu a, .tray-group.is-current .tray-entry", { y: 24, delay: 0.2 }],
      }[view];
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
      /* Dispara el dibujo del símbolo al entrar/cambiar de ensamble */
      const runMutate = () => {
        const pv = root.dataset.view;
        const pe = root.dataset.ens;
        mutate();
        if (
          root.dataset.view === "ens-detail" &&
          (pv !== "ens-detail" || pe !== root.dataset.ens)
        ) {
          drawSymbol(root.dataset.ens);
        }
        if (root.dataset.view === "ensambles" && pv !== "ensambles") {
          drawLogos();
        }
      };
      if (!animate) {
        runMutate();
        return;
      }
      /* En móvil no hay morphs: fundido simple + entradas escalonadas */
      if (isMobile()) {
        runMutate();
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
      runMutate();
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
        if (ENSEMBLES.includes(parts[1])) {
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

    /* ---------- Carrusel de videos (desktop; en móvil scroll nativo) ---------- */
    const GAP = 21, N = 7;
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

    /* ---------- Trayectoria: categorías (ruteadas por hash) ---------- */
    const TRAY_OFF = { orquestas: 0, solista: 397, camara: 794, academia: 1191, otros: 1920 };
    const trayViewport = root.querySelector(".tray-viewport");
    const trayXFor = (cat) => {
      const w = trayViewport.clientWidth || 1342;
      return (cat === "academia" || cat === "otros" ? w - 660 : w - 320) - TRAY_OFF[cat];
    };
    const trayStrip = root.querySelector(".tray-strip");
    let trayTl = null;
    const trayLinks = q(".tray-menu a");
    const setTrayCat = (cat, animate) => {
      trayLinks.forEach((b) => b.classList.toggle("is-active", b.dataset.cat === cat));
      const groups = q(".tray-group");
      groups.forEach((g) => g.classList.toggle("is-current", g.dataset.cat === cat));
      if (!animate) {
        gsap.set(trayStrip, { x: trayXFor(cat) });
        groups.forEach((g) =>
          gsap.set(g, { autoAlpha: g.dataset.cat === cat ? 1 : 0 })
        );
        gsap.set(q(".tray-entry"), { clearProps: "transform,opacity,visibility" });
        return;
      }
      /* Cambio vertical: lo anterior se desvanece subiendo, el strip se
         reposiciona en seco (invisible) y las entradas nuevas suben en cascada.
         Sin overwrite en el timeline: mataría sus propios pasos al crearse. */
      const target = groups.find((g) => g.dataset.cat === cat);
      const others = groups.filter((g) => g !== target);
      const entries = target.querySelectorAll(".tray-entry");
      if (trayTl) trayTl.kill();
      gsap.killTweensOf([trayStrip, ...groups, ...entries]);
      trayTl = gsap.timeline();
      trayTl
        .to(others, { autoAlpha: 0, y: -20, duration: 0.35, ease: "power2.in" })
        .set(others, { y: 0 })
        .set(trayStrip, { x: trayXFor(cat) })
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
    };

    /* ---------- Pestañas perfil/videos ---------- */
    const tabLinks = q("[data-tab-link]");
    const onTabClick = (e) => {
      e.preventDefault();
      const tab = e.currentTarget.dataset.tabLink;
      location.hash =
        "#/ensambles/" + root.dataset.ens + (tab === "videos" ? "/videos" : "");
    };

    /* ---------- Partículas del diente de león (home) ---------- */
    const particlesHost = root.querySelector(".particles");
    const particleTls = [];
    if (!reduceMotion && particlesHost) {
      const COUNT = 16;
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
    }

    /* ---------- Estado inicial e intro ---------- */
    const TRAY_CATS = ["orquestas", "solista", "camara", "academia", "otros"];
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

    /* ---------- Listeners ---------- */
    const onResize = () => {
      if (isMobile()) return;
      gsap.set(track, { x: txFor(idx) });
      gsap.set(trayStrip, { x: trayXFor(root.dataset.traycat || "orquestas") });
    };
    onResize();
    const mBtn = root.querySelector(".mmenu-btn");
    const onMBtn = () => root.classList.toggle("menu-open");
    mBtn.addEventListener("click", onMBtn);
    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("keydown", onKeyDown);
    strip.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    tabLinks.forEach((l) => l.addEventListener("click", onTabClick));

    const gotoParam = new URLSearchParams(location.search).get("goto");
    if (gotoParam) setTimeout(() => (location.hash = gotoParam), 1200);

    if (new URLSearchParams(location.search).has("dbg")) {
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
      const refresh = () => {
        const hit = document.elementFromPoint(hx, hy);
        d.textContent = [
          `stage=${stageEl.clientWidth} inner=${window.innerWidth} mob=${isMobile()}`,
          `svgs=${root.querySelectorAll(".ens-symbol svg").length} paths=${root.querySelectorAll(".ens-symbol [pathLength]").length} particles=${root.querySelectorAll(".particle").length}`,
          `hit(${hx},${hy})=${hit ? hit.className || hit.tagName : "none"}`,
          cs(".blurb"),
          cs(".flauta-heading"),
          cs(".name-heading"),
        ].join("\n");
      };
      refresh();
      setInterval(refresh, 800);
      document.body.appendChild(d);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      mBtn.removeEventListener("click", onMBtn);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("keydown", onKeyDown);
      strip.removeEventListener("wheel", onWheel);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      tabLinks.forEach((l) => l.removeEventListener("click", onTabClick));
      if (activeFlip) activeFlip.kill();
      if (intro) intro.kill();
      if (trayTl) trayTl.kill();
      particleTls.forEach((tl) => tl && tl.kill());
      if (particlesHost) {
        gsap.killTweensOf(particlesHost.querySelectorAll(".particle, .particle__dot"));
        particlesHost.innerHTML = "";
      }
      gsap.killTweensOf(track);
    };
  }, []);

  return (
    <div className="site" ref={rootRef} data-view="home" data-ens="nomadas" data-tab="perfil" data-traycat="orquestas">
      {/* Fondos */}
      <div className="bg bg--black" aria-hidden="true" />
      <div className="bg bg--gradient" aria-hidden="true" />
      <div className="bg bg--navy" aria-hidden="true" />
      <div className="texture" aria-hidden="true" />

      {/* Fondo de trayectoria: libre, a viewport completo */}
      <div className="tray-bg" aria-hidden="true">
        <img src="/assets/img/trayectoria-bg.png" alt="" />
      </div>
      <div className="tray-fade" aria-hidden="true" />
      <div className="tray-texture" aria-hidden="true" />

      {/* Menú móvil */}
      <button className="mmenu-btn" aria-label="Menú" />
      <div className="mmenu" aria-label="Menú móvil">
        <span className="mmenu__label">MENÚ</span>
        <a href="#/biografia">biografía</a>
        <a href="#/ensambles">ensambles</a>
        <a href="#/videos">videos</a>
        <a href="#/trayectoria">trayectoria</a>
        <a href="#/contacto">contacto</a>
      </div>

      <div className="stage">
        {/* Navegación superior */}
        <header className="topnav">
          <a className="topnav__brand" href="#/">
            <span className="topnav__name">ELIZABETH OSORIO</span>
            <span className="topnav__role">FLAUTA TRAVERSA</span>
          </a>
          <nav className="topnav__menu" aria-label="Navegación principal">
            <a href="#/biografia" data-nav="bio">BIOGRAFÍA</a>
            <a href="#/ensambles" data-nav="ensambles">ENSAMBLES</a>
            <a href="#/videos" data-nav="videos">VIDEOS</a>
            <a href="#/trayectoria" data-nav="trayectoria">TRAYECTORIA</a>
            <a href="#/contacto" data-nav="contacto">CONTACTO</a>
          </nav>
        </header>

        {/* Subnavegación de ensambles */}
        <nav className="ensnav" aria-label="Ensambles">
          <a href="#/ensambles/nomadas" data-ensnav="nomadas">nómadas ensamble</a>
          <a href="#/ensambles/entrecuerdas" data-ensnav="entrecuerdas">(flauta) entre cuerdas ensamble</a>
          <a href="#/ensambles/otros" data-ensnav="otros">otros ensambles</a>
        </nav>

        {/* Imagen héroe */}
        <div className="hero-img" aria-hidden="true">
          <div className="hero-img__slide hero-img__slide--dandelion">
            <img src="/assets/img/hero-dandelion.jpg" alt="" />
          </div>
          <div className="hero-img__slide hero-img__slide--portrait">
            <img src="/assets/img/portrait-color.jpg" alt="" />
          </div>
        </div>

        <div className="particles" aria-hidden="true" />

        <h1 className="name-heading">Elizabeth<br />Osorio.</h1>
        <p className="flauta-heading">flauta traversa</p>

        <p className="blurb">
          Flautista principal de la Orquesta Filarmónica de Medellín, profesora de flauta
          de la Universidad de Antioquia y de la Fundación Academia Filarmónica
          Iberoamericana (Colombia).
        </p>

        <a className="more-arrow" href="#/biografia/completa" aria-label="Leer biografía completa">
          <img src="/assets/svg/back-arrow.svg" alt="" />
        </a>

        <a className="back-arrow" href="#/" aria-label="Volver">
          <img src="/assets/svg/back-arrow.svg" alt="" />
        </a>

        {/* Fila de logos de ensambles */}
        <div className="logo-row">
          <a className="logo" href="#/ensambles/nomadas">
            <span className="logo__symbol" data-logo="nomadas" />
            <span className="logo__wordmark">
              <span className="logo__title logo__title--thin">nómadas</span>
              <span className="logo__sub">ensamble</span>
            </span>
          </a>
          <a className="logo" href="#/ensambles/entrecuerdas">
            <span className="logo__symbol logo__symbol--entrecuerdas" data-logo="entrecuerdas" />
            <span className="logo__wordmark">
              <span className="logo__title"><span className="w200">entre</span><span className="w300">cuerdas</span></span>
              <span className="logo__sub">ensamble</span>
            </span>
          </a>
          <a className="logo" href="#/ensambles/otros">
            <span className="logo__symbol" data-logo="otros" />
            <span className="logo__wordmark">
              <span className="logo__title logo__title--thin">otros</span>
              <span className="logo__sub">ensambles</span>
            </span>
          </a>
        </div>

        {/* Carrusel de videos */}
        <div className="videos-strip">
          <div className="videos-strip__track">
            {Array.from({ length: 7 }).map((_, i) => (
              <div className="video-card" tabIndex={0} key={i} />
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="contact-photo" aria-hidden="true">
          <img src="/assets/img/portrait-contact.jpg" alt="" />
        </div>
        <h2 className="contact-title">Contacto.</h2>
        <div className="contact-block">
          <div className="contact-block__emails">
            <a href="mailto:eli.osorio.music@gmail.com">eli.osorio.music@gmail.com</a>
            <a href="mailto:eli.osorio@flauta.com">eli.osorio@flauta.com</a>
          </div>
          <span className="contact-block__signature-box">
            <img className="contact-block__signature" src="/assets/svg/signature.svg" alt="Firma de Elizabeth Osorio" />
          </span>
        </div>

        {/* Biografía completa */}
        <section className="bio-full" aria-label="Biografía completa">
          <div className="bio-full__photo" aria-hidden="true">
            <img src="/assets/img/portrait-bio.jpg" alt="" />
            <div className="bio-full__fade" />
          </div>
          <h2 className="bio-full__title">biografía</h2>
          <div className="bio-full__cols">
            <div className="bio-full__col bio-full__col--first">
              <p>
                Elizabeth ha sido invitada como flautista<br />
                de la "Mahler Chamber Orchestra", flautista principal de la Orquesta
                Filarmónica de Bogotá y la Orquesta Sinfónica de Nacional de Colombia. Se
                desempeñó como flautista principal de la Orquesta Sinfónica Universidad
                Eafit y de la Orquesta Sinfónica Juvenil de Antioquia (Colombia). Fue
                profesora de flauta de la Universidad Javeriana (Bogotá D.C.), Universidad
                Distrital Francisco José de Caldas (Bogotá D.C.) y de la Universidad Eafit
                (Medellín). Es miembro en Colombia de los concursos interuniversitarios, el
                festival itinerante de flauta, el Seminario Medellín<br />
                entre la flauta y los ciclos de la flauta extravagante en su país.
              </p>
              <p>
                Fue seleccionada "First Prize" en "The Alexander and Buono Flute
                International Competition", el cual le permitió realizar su debut en el
                "Weill Recital Hall del Carnegie Hall" de Nueva York (USA). También ha sido
                ganadora del "Silberman Chamber Music Competition" de CMU (USA). Ha ganado
                menciones en el "Concours International du Jeune Flûtiste" en París y la
                Academia Nacional de Orquesta de Evry a cargo del Maestro Nicolas Brochot
                (Francia). Realizó un recital de música contemporánea en el "Museo
                histórico de ordenadores" del Silicon Valley, California y fue ganadora de
                el Concurso de Jóvenes Interpretes de la Biblioteca Luis Ángel Arango en
                Bogotá.
              </p>
            </div>
            <div className="bio-full__col">
              <p>
                Sus Maestros han sido Alberto Almarza y Jeanne Baxtresser en Estados
                Unidos, Vincent Lucas, Gilles Burgos, y Francois Veilhan en Francia, y en
                Colombia, Hugo Espinosa, Fabio Londoño y Mauricio Moreno.
              </p>
              <p>
                Elizabeth obtuvo su Maestría en Interpretación en la Universidad "Carnegie
                Mellon" en Pittsburgh (USA), realizó Diplomas de Estudios de Música y
                Perfeccionamiento en los Conservatorios Nacionales de Meudon y Evry
                (Francia), y su título de pregrado en la Universidad de Antioquia
                (Colombia).
              </p>
            </div>
          </div>
        </section>

        {/* Detalle de ensamble */}
        <section className="ens-view" aria-label="Detalle del ensamble">
          <div className="ens-symbol" aria-hidden="true">
            <div data-symbol="nomadas" />
            <div data-symbol="entrecuerdas" />
            <div data-symbol="otros" />
          </div>

          <p className="ens-flauta-label">Flauta</p>

          <h2 className="ens-title">
            <span data-ens-title="nomadas">nómadas<br />ensamble</span>
            <span data-ens-title="entrecuerdas">entrecuerdas<br />ensamble</span>
            <span data-ens-title="otros">otros<br />ensambles</span>
          </h2>

          <div className="ens-tabs">
            <a className="ens-tab" href="#" data-tab-link="perfil">
              <span>perfil</span><img className="ens-tab__dot" src="/assets/svg/select-dot.svg" alt="" />
            </a>
            <a className="ens-tab" href="#" data-tab-link="videos">
              <span>videos</span><img className="ens-tab__dot" src="/assets/svg/select-dot.svg" alt="" />
            </a>
          </div>

          {/* nómadas: perfil */}
          <div className="ens-content" data-ens-content="nomadas" data-tab-content="perfil">
            <div className="ens-cols">
              <div className="ens-col ens-col--text">
                <p>
                  NÓMADAS Ensamble es la línea de música popular latinoamericana de Atrato
                  Modular. Funciona como un ensamble acústico (voz, flauta, guitarra, bajo
                  y percusión) enfocado en la reinterpretación de repertorios
                  tradicionales desde una perspectiva de cámara e improvisación.
                </p>
                <p>
                  El programa Cartografía Musical Nómada recorre músicas de Colombia,
                  Brasil y América Latina, integrando choro, bossa nova y otros géneros en
                  arreglos propios. La propuesta articula tradición y lectura actual, con
                  énfasis en la circulación cultural, la memoria musical y la flexibilidad
                  escénica.<br />
                  Es un formato adaptable a distintos espacios y públicos.
                </p>
                <p>
                  NÓMADAS es el alma itinerante y rítmica de Atrato Modular. Representa la
                  hibridación: el punto exacto donde la técnica académica se encuentra con
                  el sabor, el choro y la improvisación. Su perfil es vibrante, cálido y
                  comunicativo; es un ensamble que "camina" por el continente,
                  recolectando memorias musicales y transformándolas en arreglos
                  contemporáneos que invitan a la celebración de la identidad latina.
                </p>
              </div>
              <div className="ens-col ens-col--specs">
                <h3>＊ formato</h3>
                <p>Cuarteto y quinteto popular<br />(Voz, Flauta, Guitarra, Bajo y Percusión).</p>
                <h3>＊ propuesta artística</h3>
                <p>Exploración de la música popular latinoamericana con énfasis en la memoria<br />y la circulación cultural.</p>
                <h3>＊ programas destacados</h3>
                <p>Cartografía Musical Nómada<br />Un recorrido por los ritmos de Colombia (pasillos, bambucos)<br /><br />Brasil<br />(choro, bossa nova)</p>
                <h3>＊ contexto</h3>
                <p>Festivales de músicas del mundo, centros culturales, plazas abiertas y circuitos de<br />jazz/world music.</p>
              </div>
            </div>
          </div>

          {/* entrecuerdas: perfil */}
          <div className="ens-content" data-ens-content="entrecuerdas" data-tab-content="perfil">
            <div className="ens-cols">
              <div className="ens-col ens-col--text">
                <p>
                  ENTRE CUERDAS es la faceta más introspectiva y académica de Atrato
                  Modular. Este ensamble se define por la búsqueda de texturas sonoras
                  refinadas, donde la flauta no solo lidera, sino que se sumerge en el
                  tejido armónico de las cuerdas. Su perfil es el de un laboratorio de
                  cámara que rescata estéticas olvidadas con un rigor interpretativo de
                  alto nivel, ideal para auditorios que celebran la escucha atenta y la
                  profundidad histórica.
                </p>
                <p>
                  La línea Académica de ENTRE CUERDAS es música de cámara de alto formato.
                  Esta propuesta explora la delicada interacción entre la flauta y el trío
                  o cuarteto de cuerdas, ideal para salas de cámara y festivales de
                  música.
                </p>
              </div>
              <div className="ens-col ens-col--specs">
                <h3>＊ formato</h3>
                <p>Flauta traversa y trío o cuarteto de cuerdas (Violín, Viola, Cello).</p>
                <h3>＊ propuesta artística</h3>
                <p>Un diálogo entre la tradición europea y la vanguardia latinoamericana.</p>
                <h3>＊ programas destacados</h3>
                <p>
                  Mujeres 1900<br />
                  Un homenaje a las compositoras del cambio de siglo. Un rescate histórico
                  visibilizando obras de gran factura técnica y sensibilidad
                  post-romántica e impresionista.<br /><br />
                  Música Transcontinental<br />
                  La evolución formal del formato de cámara desde el clasicismo hasta
                  América. Un puente sonoro que inicia en el rigor del clasicismo europeo
                  y culmina en la vitalidad de la academia latinoamericana.
                </p>
                <h3>＊ contexto</h3>
                <p>Conciertos de gala, festivales de música de cámara y ciclos universitarios.</p>
              </div>
            </div>
          </div>

          {/* otros: sin pestañas, columna única */}
          <div className="ens-content" data-ens-content="otros" data-tab-content="perfil">
            <div className="ens-col ens-col--specs ens-col--otros">
              <h3>＊ formatos variables</h3>
              <p>
                También hay formatos variables según el contexto de programación y
                disponibilidad instrumental, manteniendo la misma línea artística:
              </p>
              <p>
                Flauta solista con orquesta<br />Recital de flauta sola<br />Flauta y piano<br />
                Flauta y arpa<br />Trío con piano o cuerdas<br />Ensamble ampliado (hasta deceto)
              </p>
              <p>
                Estos formatos se configuran según la sala, el programa y las condiciones
                de producción. La conformación instrumental puede incluir músicos
                invitados, así como la participación de instrumentistas locales u
                orquestas del lugar.
              </p>
            </div>
          </div>

          {/* pestaña videos (rejilla compartida) */}
          <div className="ens-content ens-content--videos" data-tab-content="videos">
            <div className="ens-videos-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="ens-video-card" key={i}>
                  <span className="ens-video-card__name">Nombre del video</span>
                  <span className="ens-video-card__desc">descripción</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trayectoria */}
        <section className="trayectoria" aria-label="Trayectoria">
          <nav className="tray-menu" aria-label="Categorías de trayectoria">
            <a href="#/trayectoria/orquestas" data-cat="orquestas" className="is-active">orquestas</a>
            <a href="#/trayectoria/solista" data-cat="solista">solista</a>
            <a href="#/trayectoria/camara" data-cat="camara">música de cámara</a>
            <a href="#/trayectoria/academia" data-cat="academia">academia</a>
            <a href="#/trayectoria/otros" data-cat="otros">otros</a>
          </nav>

          <div className="tray-viewport">
            <div className="tray-strip">
              <div className="tray-group" data-cat="orquestas">
                <div className="tray-col">
                  <div className="tray-entry">
                    <h4>2023</h4>
                    <p>Festival de Música de Cartagena<br />Invitación Primera Flauta en la<br />Orquesta de Cámara de Praga<br /><em>El Canto de la Tierra</em><br />Concierto Primera Sinfonía de Prokofiev<br />Director: Zbynêk Müller</p>
                  </div>
                  <div className="tray-entry">
                    <h4>2017</h4>
                    <p>Invitada como Principal en la<br />Orquesta Filarmónica de Bogotá<br />Director: Robin O’Neal</p>
                  </div>
                  <div className="tray-entry">
                    <h4>2010</h4>
                    <p>Sinfónica Nacional de Colombia<br />Invitación como encargada de Piccolo Tutti y Principal durante diferentes montajes a lo largo del año.</p>
                  </div>
                  <div className="tray-entry">
                    <h4>2015</h4>
                    <p>Festival de Música de Cartagena<br />Invitación para hacer Flauta Tutti de la Mahler<br />Chamber Orchestra<br />Director: Teodor Currentzis</p>
                  </div>
                </div>
              </div>

              <div className="tray-group" data-cat="solista">
                <div className="tray-col">
                  <div className="tray-entry">
                    <h4>2022</h4>
                    <p>Festival de Música de Cartagena<br />Invitación como solista<br /><em>Entre el pasado y el presente</em><br />Concierto para flauta de Luis Carlos Figueroa<br />Director: Leonardo Federico Hoyos</p>
                  </div>
                </div>
              </div>

              <div className="tray-group" data-cat="camara">
                <div className="tray-col">
                  <div className="tray-entry">
                    <h4>2023</h4>
                    <p>VI Festival Internacional de Música Clásica de Bogotá<br /><em>Bogotá es Francia, La Belle Epoque</em><br />Ensamble: “Proyecto modular”<br />Flauta y cuerdas</p>
                  </div>
                  <div className="tray-entry">
                    <h4>2022</h4>
                    <p>Encuentro Nacional de Música de Cámara<br />Sala Teresita Gómez<br />Ensamble con el guitarrista León Salcedo<br /><br />Festival de música de cámara CIMA<br />Flauta, piano, corno francés y cuerdas<br />Ensamble: “Proyecto modular”<br />Manizales</p>
                  </div>
                  <div className="tray-entry">
                    <h4>2016</h4>
                    <p>Programa de circulación Alcaldía de Medellín<br />Flauta y cuerdas<br />Ensamble: “Proyecto modular”</p>
                  </div>
                </div>
              </div>

              <div className="tray-group tray-group--wide" data-cat="academia">
                <div className="tray-col">
                  <div className="tray-entry">
                    <h4>2021 ー Presente</h4>
                    <p>flautalatinoamerica.com<br />Primera Red de Mujeres Flautistas Latinoamericanas<br /><br />Portafolio Digital de<br />Partituras de Música Latinoamericana<br />para Flauta</p>
                  </div>
                  <div className="tray-entry">
                    <h4>2020</h4>
                    <p>Jurado en representación de Colombia<br />La Flauta Latinoamericana, concurso internacional</p>
                  </div>
                  <div className="tray-entry">
                    <h4>2018</h4>
                    <p>EXPOCULTURA<br />Referentes, Elizabeth Osorio</p>
                  </div>
                  <div className="tray-entry">
                    <h4>2016</h4>
                    <p>Primer Congreso de Investigación y<br />Creación Musical en Zipaquirá<br />Clases y conciertos con el pianista David Córdoba</p>
                  </div>
                </div>
                <div className="tray-col">
                  <div className="tray-entry">
                    <h4>2015 ー Presente</h4>
                    <p>Festivales: “Medellín entre la flauta”, “La flauta Itinerante”, “Concursos interuniversitarios” entre otros en Bogotá, Medellín y Manizales. Clases maestras y conciertos de música de cámara para flauta.<br /><br />Algunos invitados incluyen a Francois Veilhan (CRR Poitiers) Alberto Almarza (Carnegie Mellon University) y Vincent Lucas (CNSMD CRR Paris y Orquesta de Paris). Todos maestros de Elizabeth Osorio.</p>
                  </div>
                  <div className="tray-entry">
                    <h4>2014</h4>
                    <p>Invitación por el programa académico del Festival de Música de Cartagena para participar como profesor de las clases magistrales.</p>
                  </div>
                </div>
              </div>

              <div className="tray-group tray-group--wide" data-cat="otros">
                <div className="tray-col">
                  <div className="tray-entry">
                    <h4>Nacional</h4>
                    <p>CONVOCATORIA CELEBRA LA MÚSICA<br />EXPRESIONES SONORAS EN TORNO A LA DIVERSIDAD, LA PAZ Y LA CONVIVENCIA.<br />(2023)<br /><br />Circulación nacional de músicos<br />LA INCLUSIÓN, LA DIVERSIDAD Y SU PARADIGMA (2022)<br /><br />Beca para la realización de conciertos didácticos<br />para público infantil<br />(2016)<br /><br />Reconocimientos para artistas y agrupaciones musicales - Portafolio Musical de Colombia<br />(Convocatoria 2015)<br /><br />La orquesta más innovadora del mundo:<br />La Orquesta Filarmónica de Medellín gana el Premio<br />a la Innovación Classical: NEXT 2022 con<br />Elizabeth Osorio como flautista principal<br /><br />Grammy latino mejor álbum para niños a<br />La Orquesta Filarmónica de Medellín con<br />Elizabeth Osorio como flautista principal</p>
                  </div>
                </div>
                <div className="tray-col">
                  <div className="tray-entry">
                    <h4>Internacional</h4>
                    <p>THE FOURTH ANNUAL<br />ABC GALA<br />WINNER OF<br />THE ALEXANDER &amp; BUONO COMPETITIONS<br />Estados Unidos<br /><br />WEILL RECITAL HALL AT CARNEGIE HALL<br />Nueva York, Estados unidos<br /><br />Silberman Chamber Music Competition<br />First place, 2009<br />Carnegie Mellon University<br />Pittsburgh, Estados Unidos<br /><br />8ème Concours National du Jeune Flûtiste<br />Quintette Aria de Paris - Avon Musique &amp; Culture<br />Concurso “Aria de Paris” 2004<br />Mention “très bien”<br />Paris, Francia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
