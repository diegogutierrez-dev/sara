/* Capas fijas de fondo (crossfade por data-view) y fondo libre de trayectoria. */
export default function Backgrounds() {
  return (
    <>
      <div className="bg bg--black" aria-hidden="true" />
      <div className="bg bg--gradient" aria-hidden="true" />
      <div className="bg bg--navy" aria-hidden="true" />
      <div className="texture" aria-hidden="true" />

      <div className="tray-bg" aria-hidden="true">
        <img src="/assets/img/trayectoria-bg.png" alt="" />
      </div>
      <div className="tray-fade" aria-hidden="true" />
      <div className="tray-texture" aria-hidden="true" />
    </>
  );
}
