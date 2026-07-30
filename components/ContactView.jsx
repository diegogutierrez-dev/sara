export default function ContactView() {
  return (
    <>
      <div className="contact-photo" aria-hidden="true">
        <img src="/assets/img/portrait-contact.jpg" alt="" />
      </div>
      <h2 className="contact-title">Contacto.</h2>
      <div className="contact-block">
        <div className="contact-block__emails">
          <a href="mailto:eli.osorio.music@gmail.com">eli.osorio.music@gmail.com</a>
          <a href="mailto:eli.osorio@flauta.com">eli.osorio@flauta.com</a>
        </div>
        <span className="contact-block__signature-box">
          <img className="contact-block__signature" src="/assets/svg/signature.svg" alt="Firma de Elizabeth Osorio" />
        </span>
      </div>
    </>
  );
}
