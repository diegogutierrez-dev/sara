"use client";

import { useRef } from "react";

import Backgrounds from "../components/Backgrounds";
import MobileMenu from "../components/MobileMenu";
import TopNav from "../components/TopNav";
import EnsNav from "../components/EnsNav";
import Hero from "../components/Hero";
import EnsembleLogos from "../components/EnsembleLogos";
import VideosStrip from "../components/VideosStrip";
import ContactView from "../components/ContactView";
import BioFullView from "../components/BioFullView";
import EnsembleDetailView from "../components/EnsembleDetailView";
import TrayectoriaView from "../components/TrayectoriaView";

import { useViewRouter } from "../hooks/useViewRouter";
import { useTrayectoria } from "../hooks/useTrayectoria";
import { useVideosCarousel } from "../hooks/useVideosCarousel";
import { useDandelionParticles } from "../hooks/useDandelionParticles";
import { useDebugOverlay } from "../hooks/useDebugOverlay";

/* Escena única: todas las vistas conviven en el DOM y los data-* de la raíz
   (.site) definen el estado; GSAP Flip anima el morph entre estados. */
export default function Home() {
  const rootRef = useRef(null);

  const setTrayCat = useTrayectoria(rootRef);
  useViewRouter(rootRef, setTrayCat);
  useVideosCarousel(rootRef);
  useDandelionParticles(rootRef);
  useDebugOverlay(rootRef);

  return (
    <div className="site" ref={rootRef} data-view="home" data-ens="nomadas" data-tab="perfil" data-traycat="orquestas">
      <Backgrounds />
      <MobileMenu onToggle={() => rootRef.current.classList.toggle("menu-open")} />

      <div className="stage">
        <TopNav />
        <EnsNav />
        <Hero />

        <a className="back-arrow" href="#/" aria-label="Volver">
          <img src="/assets/svg/back-arrow.svg" alt="" />
        </a>

        <EnsembleLogos />
        <VideosStrip />
        <ContactView />
        <BioFullView />
        <EnsembleDetailView rootRef={rootRef} />
        <TrayectoriaView />
      </div>
    </div>
  );
}
