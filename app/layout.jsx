import "./globals.css";

export const metadata = {
  title: "Elizabeth Osorio — Flauta Traversa",
  description:
    "Elizabeth Osorio, flautista principal de la Orquesta Filarmónica de Medellín. Biografía, ensambles, videos y contacto.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
