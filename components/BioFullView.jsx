export default function BioFullView() {
  return (
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
  );
}
