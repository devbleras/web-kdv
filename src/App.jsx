import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 12700, label: 'seguidores en Instagram', compact: true },
  { value: 433000, label: 'likes acumulados', compact: true },
  { value: 50000000, label: 'millones de impresiones', compact: true, displayOverride: '50M' },
  { value: 15000, label: 'seguidores en Facebook', compact: true },
];

const introFacts = [
  'En el centro de Salamanca',
  'Fiestas Universitarias',
  'Música internacional',
];

const schedule = [
  { day: 'Lunes a Miércoles', hours: '23:00 - 04:00' },
  { day: 'Jueves', hours: '23:00 - 05:30' },
  { day: 'Viernes y Sábado', hours: '23:00 - 06:30' },
  { day: 'Domingo', hours: '02:00 - 04:30' },
];

const storyHighlights = [
  'Más de 30 años haciendo historia en la noche salmantina.',
  'Una mezcla propia entre legado disco, house, electrónica y comercial.',
  'Una marca reconocible, cosmopolita y vinculada al ritmo de la ciudad.',
];

const imageCandidates = {
  hero: '/assets/images/imagen2-1-1014x676.jpg',
  story: '/assets/images/img-1929-1014x811.jpg',
  logo: '/assets/images/logo.png',
  grants: '/assets/logos-subvencions-w400.jpg',
  sustainability: '/assets/sostenibilidad.pdf',
  reservados: '/assets/images/reservados.jpg',
  coverVideo: '/assets/cover.mp4',
};

const roomSliderImages = Object.entries(
  import.meta.glob('../slider/*.{jpeg,jpg,png,webp}', { eager: true, import: 'default' }),
)
  .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
  .map(([, src], index) => ({
    src,
    alt: `Interior de la sala de Kandhavia ${index + 1}`,
  }));

const reservadosWhatsapp = 'https://wa.me/34663414556';
const kandhaviaMapsPlaceUrl = 'https://www.google.com/maps/place/Discoteca+Kandhavia/@40.96562,-5.661357,18.49z/data=!4m15!1m8!3m7!1s0xd3f2613fa6a0263:0x93b8bfd94ee80727!2sCalle+Bermejeros,+16,+37001+Salamanca!3b1!8m2!3d40.96562!4d-5.6611428!16s%2Fg%2F11q2nhngp4!3m5!1s0xd3f2613fa7ec819:0xb9b1537707189664!8m2!3d40.96562!4d-5.6611428!16s%2Fg%2F1vlk2vyj?hl=es-ES&entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D';
const kandhaviaMapsEmbedUrl = 'https://www.google.com/maps?q=Discoteca%20Kandhavia%2C%20Salamanca&z=18&output=embed';

function SmartImage({ src, alt, className }) {
  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        event.currentTarget.style.display = 'none';
      }}
    />
  );
}

function formatStat(value, compact) {
  if (!compact) {
    return new Intl.NumberFormat('es-ES').format(value);
  }

  if (value >= 1000) {
    const compactValue = value >= 100000 ? Math.round(value / 1000) : Math.round((value / 1000) * 10) / 10;
    return `${String(compactValue).replace('.', ',')}k`;
  }

  return String(value);
}

function CountUpStat({ value, label, compact = false, displayOverride }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) {
      return undefined;
    }

    const duration = 1600;
    const start = performance.now();

    let frameId = 0;

    const animate = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, [hasStarted, value]);

  return (
    <article className="stat-card stat-card-minimal" ref={ref}>
      <strong>{displayOverride && displayValue >= value ? displayOverride : formatStat(displayValue, compact)}</strong>
      <span>{label}</span>
    </article>
  );
}

function useInView({ threshold = 0.25, rootMargin = '0px' } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || isVisible) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, rootMargin, threshold]);

  return [ref, isVisible];
}

function RevealSection({
  as: Tag = 'section',
  children,
  className = '',
  variant = 'up',
  threshold = 0.2,
  rootMargin = '0px 0px -10% 0px',
  ...props
}) {
  const [ref, isVisible] = useInView({ threshold, rootMargin });

  return (
    <Tag
      ref={ref}
      className={`reveal-section reveal-${variant} ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}

function Shell({ children, floatingHref = reservadosWhatsapp, floatingLabel = 'WhatsApp' }) {
  return (
    <div className="page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      {children}
      <a className="floating-cta" href={floatingHref} target="_blank" rel="noreferrer">
        <svg
          className="floating-cta-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.59 2 2.15 6.43 2.15 11.88c0 1.74.45 3.44 1.31 4.94L2 22l5.32-1.4a9.9 9.9 0 0 0 4.71 1.2h.01c5.44 0 9.88-4.43 9.88-9.88 0-2.64-1.03-5.12-2.87-7.01Zm-7.02 15.22h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.16.83.84-3.08-.2-.32a8.17 8.17 0 0 1-1.26-4.36c0-4.52 3.68-8.2 8.21-8.2 2.19 0 4.25.85 5.79 2.4a8.13 8.13 0 0 1 2.4 5.8c0 4.52-3.68 8.2-8.13 8.2Zm4.5-6.14c-.24-.12-1.4-.7-1.62-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06a6.67 6.67 0 0 1-1.96-1.2 7.32 7.32 0 0 1-1.35-1.68c-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3s-.84.82-.84 1.98.86 2.28.98 2.44c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.5.58.18 1.1.16 1.52.1.46-.07 1.4-.58 1.6-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"
          />
        </svg>
        {floatingLabel}
      </a>
    </div>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleToggleMenu = () => {
    setMenuOpen((current) => !current);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`topbar ${menuOpen ? 'menu-open' : ''}`}>
      <a className="brand" href="/" aria-label="Ir al inicio de Kandhavia">
        <SmartImage src={imageCandidates.logo} alt="Logo de Kandhavia" className="brand-logo" />
      </a>

      <div className={`menu-panel ${menuOpen ? 'is-open' : ''}`}>
        <nav
          id="main-menu"
          className={`topnav ${menuOpen ? 'is-open' : ''}`}
          aria-label="Navegación principal"
        >
          <a href="/#experiencia" onClick={handleCloseMenu}>Experiencia</a>
          <a href="/#legado" onClick={handleCloseMenu}>Legado</a>
          <a href="/#contacto" onClick={handleCloseMenu}>Contacto</a>
          <a href="/reservados" onClick={handleCloseMenu}>Reservados</a>
        </nav>
      </div>

      <button
        type="button"
        className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuOpen}
        aria-controls="main-menu"
        onClick={handleToggleMenu}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}

function RoomSliderSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = roomSliderImages.length;

  if (!totalSlides) {
    return null;
  }

  const handlePrevious = () => {
    setActiveIndex((current) => (current - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % totalSlides);
  };

  return (
    <RevealSection
      className="section room-slider-section"
      variant="up"
      aria-labelledby="room-slider-title"
    >
      <div className="section-heading room-slider-heading">
        <span className="eyebrow">La sala</span>
        <h2 id="room-slider-title">Descubre cómo se ve Kandhavia por dentro.</h2>
        <p>
          Un recorrido visual por el ambiente, la iluminación y la energía real de la sala.
        </p>
      </div>

      <div className="room-slider-shell">
        <div className="room-slider-stage">
          <div
            className="room-slider-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {roomSliderImages.map((image) => (
              <div key={image.src} className="room-slide">
                <SmartImage src={image.src} alt={image.alt} className="room-slide-image" />
              </div>
            ))}
          </div>

          {totalSlides > 1 ? (
            <>
              <button
                type="button"
                className="room-slider-control room-slider-control-prev"
                aria-label="Ver foto anterior"
                onClick={handlePrevious}
              >
                <span aria-hidden="true">‹</span>
              </button>

              <button
                type="button"
                className="room-slider-control room-slider-control-next"
                aria-label="Ver foto siguiente"
                onClick={handleNext}
              >
                <span aria-hidden="true">›</span>
              </button>
            </>
          ) : null}
        </div>

        {totalSlides > 1 ? (
          <div className="room-slider-footer">
            <div className="room-slider-dots" aria-label="Selector de fotos">
              {roomSliderImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={`room-slider-dot ${index === activeIndex ? 'is-active' : ''}`}
                  aria-label={`Ir a la foto ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>

            <span className="room-slider-count">
              {String(activeIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
          </div>
        ) : null}
      </div>
    </RevealSection>
  );
}

function HomePage() {
  const [introCopyRef, introCopyVisible] = useInView({ threshold: 0.3 });
  const [introVideoRef, introVideoVisible] = useInView({ threshold: 0.3 });

  useEffect(() => {
    document.title = 'Kandhavia | Discoteca en Salamanca y fiestas universitarias';

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute(
        'content',
        'Kandhavia, discoteca en Salamanca y referencia del ocio nocturno. Descubre dónde salir de fiesta en Salamanca, reservados VIP, música internacional y noches universitarias.',
      );
    }
  }, []);

  return (
    <Shell>
      <SiteHeader />

      <main>
        <RevealSection className="hero" id="inicio" variant="up" threshold={0.15}>
          <div className="hero-lights" aria-hidden="true">
            <span className="hero-light hero-light-one" />
            <span className="hero-light hero-light-two" />
            <span className="hero-light hero-light-three" />
            <span className="hero-light hero-light-four" />
          </div>

          <div className="hero-copy">
            <div className="eyebrow">Discoteca de referencia en Salamanca</div>

            <div className="logo-stack">
              <SmartImage src={imageCandidates.logo} alt="Logo de Kandhavia" className="hero-logo hero-logo-main" />
            </div>

            <p className="hero-lead">
              Kandhavia no se explica. Se vive.
              <br />
              Más de 30 años marcando la noche de Salamanca.
              <br />
              Fiestas universitarias, música internacional y un sonido que nunca falla.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="https://salamancayfiesta.com" target="_blank" rel="noreferrer">
                Comprar entradas
              </a>
              <a className="button button-secondary" href="/reservados">
                Reservados
              </a>
              <a className="button button-secondary" href="https://www.instagram.com/kandhavia" target="_blank" rel="noreferrer">
                Ver Instagram
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-frame">
              <SmartImage src={imageCandidates.hero} alt="" className="hero-photo" />
              <div className="hero-overlay-card">
                <span>Desde 1990s</span>
                <strong>Más de 30 años marcando la noche</strong>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="section section-intro" id="experiencia" variant="up">
          <div className="intro-grid">
            <div
              ref={introCopyRef}
              className={`intro-copy-block ${introCopyVisible ? 'is-visible' : ''}`}
            >
              <span className="eyebrow">La experiencia</span>
              <h2>
                Un club con imagen actual y alma de <span className="accent-text">icono local</span>.
              </h2>
            </div>

            <article
              ref={introVideoRef}
              className={`copy-card copy-card-large intro-video-card ${introVideoVisible ? 'is-visible' : ''}`}
            >
              <video
                className="intro-video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={imageCandidates.coverVideo} type="video/mp4" />
              </video>

              <div className="intro-video-overlay">
                <h3>
                  Una noche reconocible desde que entras hasta que sales.
                  <br />
                  Esto es #SonidoKandhavia
                </h3>
                <div className="intro-facts">
                  {introFacts.map((fact) => (
                    <span key={fact}>{fact}</span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </RevealSection>

        <RevealSection className="section section-story" id="legado" variant="left">
          <div className="story-visual">
            <div className="story-photo-frame">
              <SmartImage src={imageCandidates.story} alt="Ambiente de Kandhavia" className="story-photo" />
            </div>
          </div>

          <div className="story-copy">
            <span className="eyebrow">Historia, legado y música</span>
            <h2>Una trayectoria que ha marcado generaciones enteras.</h2>
            <p>
              Kandhavia cuenta con más de 30 años de historia y ha dejado huella en la vida nocturna
              de Salamanca. Por su pista han pasado millones de personas y su sonido ha acompañado
              cambios de época, tendencias y formas de vivir la noche.
            </p>
            <p>
              Desde el legado de los 80 y 90 hasta el house, la electrónica y el mejor sonido
              comercial, la marca ha construido una identidad propia reconocible dentro y fuera de la
              ciudad: <strong>#SonidoKandhavia</strong>.
            </p>

            <ul className="story-list">
              {storyHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </RevealSection>

        <RevealSection className="section section-stats" variant="up" aria-labelledby="impacto-title">
          <div className="section-heading">
            <span className="eyebrow">Nuestras redes</span>
            <h2 id="impacto-title">Mucho más que una discoteca.</h2>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => (
              <CountUpStat
                key={stat.label}
                value={stat.value}
                label={stat.label}
                compact={stat.compact}
                displayOverride={stat.displayOverride}
              />
            ))}
          </div>
        </RevealSection>

        <RevealSection className="section section-booking" variant="right">
          <div className="booking-panel">
            <div className="booking-copy">
              <span className="eyebrow">Reservados</span>
              <h2>Reserva tu VIP y disfruta de una noche espectacular.</h2>
              <p>
                Reservado con botellas desde 200€, incluye reservado VIP acordonado y refrescos.
              </p>

              <div className="booking-actions">
                <a className="button button-primary" href="/reservados">
                  Ir a reservados
                </a>
                <a className="button button-ghost" href={reservadosWhatsapp} target="_blank" rel="noreferrer">
                  Envíanos un Whatsapp
                </a>
              </div>
            </div>

            <div className="booking-visual">
              <SmartImage
                src={imageCandidates.reservados}
                alt="Reservados en Kandhavia"
                className="booking-image"
              />
            </div>
          </div>
        </RevealSection>

        <RoomSliderSection />

        <RevealSection className="section section-contact" id="contacto" variant="left">
          <div className="contact-card">
            <div className="contact-copy">
              <span className="eyebrow">Contacto</span>
              <h2>Todo lo necesario para planear la noche.</h2>

              <div className="contact-block">
                <h3>Horario</h3>
                <ul className="schedule-list">
                  {schedule.map((item) => (
                    <li key={item.day}>
                      <span>{item.day}</span>
                      <strong>{item.hours}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="contact-grid">
                <div>
                  <h3>Dirección</h3>
                  <p>
                    <a href={kandhaviaMapsPlaceUrl} target="_blank" rel="noreferrer">
                      Calle Bermejeros, 16, 37001 Salamanca
                    </a>
                  </p>
                </div>
                <div>
                  <h3>Telefono</h3>
                  <p>
                    <a href="tel:+34637538165">637 538 165</a>
                  </p>
                </div>
                <div>
                  <h3>Email</h3>
                  <p>
                    <a href="mailto:pablo@grupokandhavia.com">pablo@grupokandhavia.com</a>
                  </p>
                </div>
                <div>
                  <h3>Redes</h3>
                  <div className="social-icons">
                    <a
                      href="https://instagram.com/kandhavia"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram de Kandhavia"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path
                          fill="currentColor"
                          d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85Zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65Z"
                        />
                      </svg>
                    </a>
                    <a
                      href="https://facebook.com/kandhaviasalamanca"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook de Kandhavia"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path
                          fill="currentColor"
                          d="M13.5 22v-8.2h2.76l.41-3.2H13.5V8.55c0-.93.26-1.55 1.6-1.55h1.71V4.14c-.3-.04-1.3-.14-2.47-.14-2.45 0-4.14 1.5-4.14 4.24v2.36H7.4v3.2h2.8V22h3.3Z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-side">
              <div className="map-frame">
                <iframe
                  title="Mapa de Kandhavia"
                  src={kandhaviaMapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="resources-card">
                <div>
                  <span className="eyebrow">Sostenibilidad</span>
                </div>
                <div className="resources-actions">
                  <a href={imageCandidates.sustainability} target="_blank" rel="noreferrer" aria-label="Abrir documento de sostenibilidad">
                    <SmartImage src={imageCandidates.grants} alt="Logos de sostenibilidad y subvenciones" className="grants-image" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </main>
    </Shell>
  );
}

function ReservadosPage() {
  useEffect(() => {
    document.title = 'Reservados VIP en Salamanca | Kandhavia';

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute(
        'content',
        'Reserva tu VIP en Kandhavia Salamanca. Reservados con botellas, zona acordonada, refrescos y atención directa por WhatsApp.',
      );
    }
  }, []);

  return (
    <Shell floatingHref={reservadosWhatsapp} floatingLabel="Reservar por WhatsApp">
      <SiteHeader reservadosButtonLabel="Volver al inicio" reservadosButtonHref="/" />

      <main className="reservados-main">
        <RevealSection className="section reservados-hero" variant="up">
          <div className="reservados-copy">
            <span className="eyebrow">Reservados en Kandhavia</span>
            <h1>Tu espacio VIP en Salamanca.</h1>
            <p className="hero-lead">
              Para información y reservas, contacta directamente por WhatsApp desde el botón de
              abajo y asegura tu noche en Kandhavia.
            </p>

            <div className="reservados-meta">
              <span>SALAMANCA</span>
              <span>KANDHAVIA</span>
              <span>VIP EXPERIENCE</span>
            </div>

            <div className="hero-actions">
              <a className="button button-primary" href={reservadosWhatsapp} target="_blank" rel="noreferrer">
                Abrir chat en WhatsApp
              </a>
              <a className="button button-secondary" href="tel:+34663414556">
                Llamar ahora
              </a>
            </div>
          </div>

          <div className="reservados-visual">
            <div className="hero-frame reservados-frame">
              <SmartImage src={imageCandidates.reservados} alt="Reservados VIP en Kandhavia" className="hero-photo reservados-photo" />
            </div>
          </div>
        </RevealSection>

        <RevealSection className="section reservados-info" variant="right">
          <div className="copy-card reservados-card">
            <span className="eyebrow">Condiciones</span>
            <h2>Nuestros reservados funcionan por botellas.</h2>
            <p>
              Se requiere la compra de un mínimo de <strong>2 botellas</strong> para disponer de un
              reservado.
            </p>
            <p>
              Contacta y reserva tu espacio VIP en la discoteca más famosa de Salamanca:
              <strong> Kandhavia</strong>.
            </p>
          </div>

          <div className="editorial-card reservados-note">
            <span>Información</span>
            <h3>Atención rápida por WhatsApp</h3>
            <p>
              Pulsa el botón para abrir el chat con el número <strong>+34 663 414 556</strong> y
              gestionar tu reserva de forma directa.
            </p>
            <a className="button button-ghost" href={reservadosWhatsapp} target="_blank" rel="noreferrer">
              Hablar por WhatsApp
            </a>
          </div>
        </RevealSection>
      </main>
    </Shell>
  );
}

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';

  if (pathname === '/reservados') {
    return <ReservadosPage />;
  }

  return <HomePage />;
}

export default App;
