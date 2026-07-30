/* Carrusel de videos (placeholders, así están en el diseño). El arrastre,
   rueda y teclado los maneja hooks/useVideosCarousel. */
export default function VideosStrip() {
  return (
    <div className="videos-strip">
      <div className="videos-strip__track">
        {Array.from({ length: 7 }).map((_, i) => (
          <div className="video-card" tabIndex={0} key={i} />
        ))}
      </div>
    </div>
  );
}
