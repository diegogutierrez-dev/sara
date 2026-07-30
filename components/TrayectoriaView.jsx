import { TRAY_MENU, TRAY_GROUPS } from "../data/trayectoria";

/* Trayectoria: menú de categorías + strip horizontal de grupos. El
   posicionamiento y las transiciones viven en hooks/useTrayectoria. */
export default function TrayectoriaView() {
  return (
    <section className="trayectoria" aria-label="Trayectoria">
      <nav className="tray-menu" aria-label="Categorías de trayectoria">
        {TRAY_MENU.map((item, i) => (
          <a
            key={item.cat}
            href={`#/trayectoria/${item.cat}`}
            data-cat={item.cat}
            className={i === 0 ? "is-active" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="tray-viewport">
        <div className="tray-strip">
          {TRAY_GROUPS.map((group) => (
            <div
              key={group.cat}
              className={`tray-group${group.wide ? " tray-group--wide" : ""}`}
              data-cat={group.cat}
            >
              {group.cols.map((col, i) => (
                <div className="tray-col" key={i}>
                  {col.map((entry, j) => (
                    <div className="tray-entry" key={j}>
                      <h4>{entry.year}</h4>
                      <p>{entry.body}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
