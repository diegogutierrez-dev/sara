import { ENSEMBLES } from "../data/ensembles";

/* Detalle de ensamble: símbolo, título y contenidos por pestaña. Qué bloque
   se ve lo deciden data-ens / data-tab en la raíz (hooks/useViewRouter). */
export default function EnsembleDetailView({ rootRef }) {
  const onTabClick = (tab) => (e) => {
    e.preventDefault();
    const ens = rootRef.current.dataset.ens;
    window.location.hash = `#/ensambles/${ens}${tab === "videos" ? "/videos" : ""}`;
  };

  return (
    <section className="ens-view" aria-label="Detalle del ensamble">
      <div className="ens-symbol" aria-hidden="true">
        {ENSEMBLES.map((ens) => (
          <img key={ens.slug} data-symbol={ens.slug} src={ens.symbolSrc} alt="" />
        ))}
      </div>

      <p className="ens-flauta-label">Flauta</p>

      <h2 className="ens-title">
        {ENSEMBLES.map((ens) => (
          <span key={ens.slug} data-ens-title={ens.slug}>{ens.detailTitle}</span>
        ))}
      </h2>

      <div className="ens-tabs">
        {["perfil", "videos"].map((tab) => (
          <a key={tab} className="ens-tab" href="#" data-tab-link={tab} onClick={onTabClick(tab)}>
            <span>{tab}</span><img className="ens-tab__dot" src="/assets/svg/select-dot.svg" alt="" />
          </a>
        ))}
      </div>

      {ENSEMBLES.map((ens) => (
        <div key={ens.slug} className="ens-content" data-ens-content={ens.slug} data-tab-content="perfil">
          {ens.perfilText ? (
            <div className="ens-cols">
              <div className="ens-col ens-col--text">{ens.perfilText}</div>
              <div className="ens-col ens-col--specs">{ens.perfilSpecs}</div>
            </div>
          ) : (
            /* otros: sin pestañas, columna única */
            <div className="ens-col ens-col--specs ens-col--otros">{ens.perfilSpecs}</div>
          )}
        </div>
      ))}

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
  );
}
