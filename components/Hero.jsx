/* Home: imagen héroe (diente de león ↔ retrato), partículas, titulares y reseña. */
export default function Hero() {
  return (
    <>
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
    </>
  );
}
