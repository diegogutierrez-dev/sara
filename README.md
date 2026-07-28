# Elizabeth Osorio — Flauta Traversa

Sitio one-page para la flautista Elizabeth Osorio, implementado desde el diseño
de Figma (`elizabeth-osorio-lp`, pages **Desktop** y **Mobile**).

**Stack:** Next.js 15 · React 19 · GSAP (Flip) · CSS puro.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000 (usa -p 3001 si el puerto está ocupado)
```

## Notas

- Rutas por hash: `#/biografia`, `#/biografia/completa`, `#/ensambles/nomadas/videos`,
  `#/trayectoria/academia`, `#/videos`, `#/contacto`.
- Desktop fluido entre 900–1440px (max-width centrado por encima); `<900px` usa el
  layout de la page Mobile de Figma (barra con menú "+", vistas apiladas).
- Parámetros de desarrollo: `?nointro` (salta la intro), `?dbg` (overlay de estilos),
  `?goto=%23/ruta` (navega tras 1.2s, para probar transiciones).
- La tipografía serif del diseño es **Kugile**; si no está instalada cae a
  DM Serif Display (autoalojada). Para fidelidad exacta añade el webfont de Kugile
  en `public/assets/fonts/` y su `@font-face` en `app/globals.css`.
- Tarjetas de video y contenidos de las pestañas "videos" son placeholders (así
  están en el diseño).

## Deploy

Es una app Next.js estándar — en Vercel basta importar el repo (framework
autodetectado, sin configuración extra).
