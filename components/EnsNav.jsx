import { ENSEMBLES } from "../data/ensembles";

export default function EnsNav() {
  return (
    <nav className="ensnav" aria-label="Ensambles">
      {ENSEMBLES.map((ens) => (
        <a key={ens.slug} href={`#/ensambles/${ens.slug}`} data-ensnav={ens.slug}>
          {ens.navLabel}
        </a>
      ))}
    </nav>
  );
}
