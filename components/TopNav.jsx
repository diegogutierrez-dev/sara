import { NAV_LINKS } from "../data/nav";

export default function TopNav() {
  return (
    <header className="topnav">
      <a className="topnav__brand" href="#/">
        <span className="topnav__name">ELIZABETH OSORIO</span>
        <span className="topnav__role">FLAUTA TRAVERSA</span>
      </a>
      <nav className="topnav__menu" aria-label="Navegación principal">
        {NAV_LINKS.map((link) => (
          <a key={link.nav} href={link.hash} data-nav={link.nav}>
            {link.label.toUpperCase()}
          </a>
        ))}
      </nav>
    </header>
  );
}
