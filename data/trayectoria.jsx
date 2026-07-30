/* Trayectoria: categorías, entradas y geometría del strip horizontal. */

export const TRAY_CATS = ["orquestas", "solista", "camara", "academia", "otros"];

/* Offset horizontal (px) de cada grupo dentro de .tray-strip; acoplado a los
   anchos de columna definidos en styles/trayectoria.css. */
export const TRAY_OFFSETS = { orquestas: 0, solista: 397, camara: 794, academia: 1191, otros: 1920 };

export const TRAY_MENU = [
  { cat: "orquestas", label: "orquestas" },
  { cat: "solista", label: "solista" },
  { cat: "camara", label: "música de cámara" },
  { cat: "academia", label: "academia" },
  { cat: "otros", label: "otros" },
];

/* Cada grupo es una lista de columnas; los grupos `wide` ocupan dos. */
export const TRAY_GROUPS = [
  {
    cat: "orquestas",
    wide: false,
    cols: [
      [
        {
          year: "2023",
          body: (
            <>Festival de Música de Cartagena<br />Invitación Primera Flauta en la<br />Orquesta de Cámara de Praga<br /><em>El Canto de la Tierra</em><br />Concierto Primera Sinfonía de Prokofiev<br />Director: Zbynêk Müller</>
          ),
        },
        {
          year: "2017",
          body: (
            <>Invitada como Principal en la<br />Orquesta Filarmónica de Bogotá<br />Director: Robin O’Neal</>
          ),
        },
        {
          year: "2010",
          body: (
            <>Sinfónica Nacional de Colombia<br />Invitación como encargada de Piccolo Tutti y Principal durante diferentes montajes a lo largo del año.</>
          ),
        },
        {
          year: "2015",
          body: (
            <>Festival de Música de Cartagena<br />Invitación para hacer Flauta Tutti de la Mahler<br />Chamber Orchestra<br />Director: Teodor Currentzis</>
          ),
        },
      ],
    ],
  },
  {
    cat: "solista",
    wide: false,
    cols: [
      [
        {
          year: "2022",
          body: (
            <>Festival de Música de Cartagena<br />Invitación como solista<br /><em>Entre el pasado y el presente</em><br />Concierto para flauta de Luis Carlos Figueroa<br />Director: Leonardo Federico Hoyos</>
          ),
        },
      ],
    ],
  },
  {
    cat: "camara",
    wide: false,
    cols: [
      [
        {
          year: "2023",
          body: (
            <>VI Festival Internacional de Música Clásica de Bogotá<br /><em>Bogotá es Francia, La Belle Epoque</em><br />Ensamble: “Proyecto modular”<br />Flauta y cuerdas</>
          ),
        },
        {
          year: "2022",
          body: (
            <>Encuentro Nacional de Música de Cámara<br />Sala Teresita Gómez<br />Ensamble con el guitarrista León Salcedo<br /><br />Festival de música de cámara CIMA<br />Flauta, piano, corno francés y cuerdas<br />Ensamble: “Proyecto modular”<br />Manizales</>
          ),
        },
        {
          year: "2016",
          body: (
            <>Programa de circulación Alcaldía de Medellín<br />Flauta y cuerdas<br />Ensamble: “Proyecto modular”</>
          ),
        },
      ],
    ],
  },
  {
    cat: "academia",
    wide: true,
    cols: [
      [
        {
          year: "2021 ー Presente",
          body: (
            <>flautalatinoamerica.com<br />Primera Red de Mujeres Flautistas Latinoamericanas<br /><br />Portafolio Digital de<br />Partituras de Música Latinoamericana<br />para Flauta</>
          ),
        },
        {
          year: "2020",
          body: (
            <>Jurado en representación de Colombia<br />La Flauta Latinoamericana, concurso internacional</>
          ),
        },
        {
          year: "2018",
          body: (
            <>EXPOCULTURA<br />Referentes, Elizabeth Osorio</>
          ),
        },
        {
          year: "2016",
          body: (
            <>Primer Congreso de Investigación y<br />Creación Musical en Zipaquirá<br />Clases y conciertos con el pianista David Córdoba</>
          ),
        },
      ],
      [
        {
          year: "2015 ー Presente",
          body: (
            <>Festivales: “Medellín entre la flauta”, “La flauta Itinerante”, “Concursos interuniversitarios” entre otros en Bogotá, Medellín y Manizales. Clases maestras y conciertos de música de cámara para flauta.<br /><br />Algunos invitados incluyen a Francois Veilhan (CRR Poitiers) Alberto Almarza (Carnegie Mellon University) y Vincent Lucas (CNSMD CRR Paris y Orquesta de Paris). Todos maestros de Elizabeth Osorio.</>
          ),
        },
        {
          year: "2014",
          body: (
            <>Invitación por el programa académico del Festival de Música de Cartagena para participar como profesor de las clases magistrales.</>
          ),
        },
      ],
    ],
  },
  {
    cat: "otros",
    wide: true,
    cols: [
      [
        {
          year: "Nacional",
          body: (
            <>CONVOCATORIA CELEBRA LA MÚSICA<br />EXPRESIONES SONORAS EN TORNO A LA DIVERSIDAD, LA PAZ Y LA CONVIVENCIA.<br />(2023)<br /><br />Circulación nacional de músicos<br />LA INCLUSIÓN, LA DIVERSIDAD Y SU PARADIGMA (2022)<br /><br />Beca para la realización de conciertos didácticos<br />para público infantil<br />(2016)<br /><br />Reconocimientos para artistas y agrupaciones musicales - Portafolio Musical de Colombia<br />(Convocatoria 2015)<br /><br />La orquesta más innovadora del mundo:<br />La Orquesta Filarmónica de Medellín gana el Premio<br />a la Innovación Classical: NEXT 2022 con<br />Elizabeth Osorio como flautista principal<br /><br />Grammy latino mejor álbum para niños a<br />La Orquesta Filarmónica de Medellín con<br />Elizabeth Osorio como flautista principal</>
          ),
        },
      ],
      [
        {
          year: "Internacional",
          body: (
            <>THE FOURTH ANNUAL<br />ABC GALA<br />WINNER OF<br />THE ALEXANDER &amp; BUONO COMPETITIONS<br />Estados Unidos<br /><br />WEILL RECITAL HALL AT CARNEGIE HALL<br />Nueva York, Estados unidos<br /><br />Silberman Chamber Music Competition<br />First place, 2009<br />Carnegie Mellon University<br />Pittsburgh, Estados Unidos<br /><br />8ème Concours National du Jeune Flûtiste<br />Quintette Aria de Paris - Avon Musique &amp; Culture<br />Concurso “Aria de Paris” 2004<br />Mention “très bien”<br />Paris, Francia</>
          ),
        },
      ],
    ],
  },
];
