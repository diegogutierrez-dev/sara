/* Contenido de los ensambles: subnav, logos del home y textos del detalle.
   `perfilText: null` (otros) se renderiza en columna única sin pestañas. */

export const ENSEMBLE_SLUGS = ["nomadas", "entrecuerdas", "otros"];

export const ENSEMBLES = [
  {
    slug: "nomadas",
    navLabel: "nómadas ensamble",
    logoSrc: "/assets/svg/logo-nomadas.svg",
    logoSymbolClass: "logo__symbol",
    symbolSrc: "/assets/svg/symbol-nomadas-big.svg",
    wordmark: (
      <>
        <span className="logo__title logo__title--thin">nómadas</span>
        <span className="logo__sub">ensamble</span>
      </>
    ),
    detailTitle: (
      <>
        nómadas<br />ensamble
      </>
    ),
    perfilText: (
      <>
        <p>
          NÓMADAS Ensamble es la línea de música popular latinoamericana de Atrato
          Modular. Funciona como un ensamble acústico (voz, flauta, guitarra, bajo
          y percusión) enfocado en la reinterpretación de repertorios
          tradicionales desde una perspectiva de cámara e improvisación.
        </p>
        <p>
          El programa Cartografía Musical Nómada recorre músicas de Colombia,
          Brasil y América Latina, integrando choro, bossa nova y otros géneros en
          arreglos propios. La propuesta articula tradición y lectura actual, con
          énfasis en la circulación cultural, la memoria musical y la flexibilidad
          escénica.<br />
          Es un formato adaptable a distintos espacios y públicos.
        </p>
        <p>
          NÓMADAS es el alma itinerante y rítmica de Atrato Modular. Representa la
          hibridación: el punto exacto donde la técnica académica se encuentra con
          el sabor, el choro y la improvisación. Su perfil es vibrante, cálido y
          comunicativo; es un ensamble que "camina" por el continente,
          recolectando memorias musicales y transformándolas en arreglos
          contemporáneos que invitan a la celebración de la identidad latina.
        </p>
      </>
    ),
    perfilSpecs: (
      <>
        <h3>＊ formato</h3>
        <p>Cuarteto y quinteto popular<br />(Voz, Flauta, Guitarra, Bajo y Percusión).</p>
        <h3>＊ propuesta artística</h3>
        <p>Exploración de la música popular latinoamericana con énfasis en la memoria<br />y la circulación cultural.</p>
        <h3>＊ programas destacados</h3>
        <p>Cartografía Musical Nómada<br />Un recorrido por los ritmos de Colombia (pasillos, bambucos)<br /><br />Brasil<br />(choro, bossa nova)</p>
        <h3>＊ contexto</h3>
        <p>Festivales de músicas del mundo, centros culturales, plazas abiertas y circuitos de<br />jazz/world music.</p>
      </>
    ),
  },
  {
    slug: "entrecuerdas",
    navLabel: "(flauta) entre cuerdas ensamble",
    logoSrc: "/assets/svg/logo-entrecuerdas.svg",
    logoSymbolClass: "logo__symbol logo__symbol--entrecuerdas",
    symbolSrc: "/assets/svg/symbol-entrecuerdas-big.svg",
    wordmark: (
      <>
        <span className="logo__title"><span className="w200">entre</span><span className="w300">cuerdas</span></span>
        <span className="logo__sub">ensamble</span>
      </>
    ),
    detailTitle: (
      <>
        entrecuerdas<br />ensamble
      </>
    ),
    perfilText: (
      <>
        <p>
          ENTRE CUERDAS es la faceta más introspectiva y académica de Atrato
          Modular. Este ensamble se define por la búsqueda de texturas sonoras
          refinadas, donde la flauta no solo lidera, sino que se sumerge en el
          tejido armónico de las cuerdas. Su perfil es el de un laboratorio de
          cámara que rescata estéticas olvidadas con un rigor interpretativo de
          alto nivel, ideal para auditorios que celebran la escucha atenta y la
          profundidad histórica.
        </p>
        <p>
          La línea Académica de ENTRE CUERDAS es música de cámara de alto formato.
          Esta propuesta explora la delicada interacción entre la flauta y el trío
          o cuarteto de cuerdas, ideal para salas de cámara y festivales de
          música.
        </p>
      </>
    ),
    perfilSpecs: (
      <>
        <h3>＊ formato</h3>
        <p>Flauta traversa y trío o cuarteto de cuerdas (Violín, Viola, Cello).</p>
        <h3>＊ propuesta artística</h3>
        <p>Un diálogo entre la tradición europea y la vanguardia latinoamericana.</p>
        <h3>＊ programas destacados</h3>
        <p>
          Mujeres 1900<br />
          Un homenaje a las compositoras del cambio de siglo. Un rescate histórico
          visibilizando obras de gran factura técnica y sensibilidad
          post-romántica e impresionista.<br /><br />
          Música Transcontinental<br />
          La evolución formal del formato de cámara desde el clasicismo hasta
          América. Un puente sonoro que inicia en el rigor del clasicismo europeo
          y culmina en la vitalidad de la academia latinoamericana.
        </p>
        <h3>＊ contexto</h3>
        <p>Conciertos de gala, festivales de música de cámara y ciclos universitarios.</p>
      </>
    ),
  },
  {
    slug: "otros",
    navLabel: "otros ensambles",
    logoSrc: "/assets/svg/logo-otros.svg",
    logoSymbolClass: "logo__symbol",
    symbolSrc: "/assets/svg/symbol-otros-big.svg",
    wordmark: (
      <>
        <span className="logo__title logo__title--thin">otros</span>
        <span className="logo__sub">ensambles</span>
      </>
    ),
    detailTitle: (
      <>
        otros<br />ensambles
      </>
    ),
    perfilText: null,
    perfilSpecs: (
      <>
        <h3>＊ formatos variables</h3>
        <p>
          También hay formatos variables según el contexto de programación y
          disponibilidad instrumental, manteniendo la misma línea artística:
        </p>
        <p>
          Flauta solista con orquesta<br />Recital de flauta sola<br />Flauta y piano<br />
          Flauta y arpa<br />Trío con piano o cuerdas<br />Ensamble ampliado (hasta deceto)
        </p>
        <p>
          Estos formatos se configuran según la sala, el programa y las condiciones
          de producción. La conformación instrumental puede incluir músicos
          invitados, así como la participación de instrumentistas locales u
          orquestas del lugar.
        </p>
      </>
    ),
  },
];
