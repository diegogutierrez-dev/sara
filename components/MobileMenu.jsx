import { NAV_LINKS } from "../data/nav";

export default function MobileMenu({ onToggle }) {
  return (
    <>
      <button className="mmenu-btn" aria-label="Menú" onClick={onToggle} />
      <div className="mmenu" aria-label="Menú móvil">
        <span className="mmenu__label">MENÚ</span>
        {NAV_LINKS.map((link) => (
          <a key={link.nav} href={link.hash}>{link.label}</a>
        ))}
      </div>
    </>
  );
}
