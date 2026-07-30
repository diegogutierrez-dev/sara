import { ENSEMBLES } from "../data/ensembles";

/* Vista ensambles: fila de logos con wordmark. */
export default function EnsembleLogos() {
  return (
    <div className="logo-row">
      {ENSEMBLES.map((ens) => (
        <a key={ens.slug} className="logo" href={`#/ensambles/${ens.slug}`}>
          <span className={ens.logoSymbolClass}><img src={ens.logoSrc} alt="" /></span>
          <span className="logo__wordmark">{ens.wordmark}</span>
        </a>
      ))}
    </div>
  );
}
