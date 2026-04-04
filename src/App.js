import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import starVideo from "./starry-sky-loop.mp4";

const sections = ["intro", "about", "portfolio"];
const navLabels = ["Introduction", "About Me", "Projects"];
const projectTitles = ["Blog Website", "Product Showcase", "Tamarind Leaf Detection"];

const projectImages = [
  ["/img/6.jpg", "/img/7.jpg", "/img/8.jpg", "/img/9.jpg", "/img/10.jpg", "/img/11.jpg", "/img/12.jpg"],
  ["/img/1.jpg", "/img/2.jpg", "/img/3.jpg", "/img/4.jpg", "/img/5.jpg"],
  ["/img/13.jpg", "/img/14.jpg", "/img/15.jpg", "/img/16.jpg", "/img/17.jpg", "/img/18.jpg", "/img/19.jpg"],
];

/** Stack carousel: active on top; prev/next peek from the sides; rest hidden behind. */
function carouselSlideRole(i, active, len) {
  if (len <= 1) return i === active ? "active" : "hidden";
  if (len === 2) return i === active ? "active" : "peer";
  const prev = (active - 1 + len) % len;
  const next = (active + 1) % len;
  if (i === active) return "active";
  if (i === prev) return "prev";
  if (i === next) return "next";
  return "hidden";
}

function App() {
  const [index, setIndex] = useState(0);
  const [activeProject, setActiveProject] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [visibleSections, setVisibleSections] = useState({
    intro: true,
    about: false,
    portfolio: false,
  });

  const mainStageRef = useRef(null);
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastFocusRef = useRef(null);
  const videoRef = useRef(null);
  const touchRef = useRef({ x: null, y: null });

  const openProject = useCallback((i) => {
    lastFocusRef.current = document.activeElement;
    setActiveProject(i);
    setSlideIndex(0);
  }, []);

  const closeProject = useCallback(() => {
    setActiveProject(null);
    requestAnimationFrame(() => {
      lastFocusRef.current?.focus?.();
    });
  }, []);

  const nextSlide = useCallback(() => {
    if (activeProject === null) return;
    const max = projectImages[activeProject].length - 1;
    setSlideIndex((prev) => (prev === max ? 0 : prev + 1));
  }, [activeProject]);

  const prevSlide = useCallback(() => {
    if (activeProject === null) return;
    const max = projectImages[activeProject].length - 1;
    setSlideIndex((prev) => (prev === 0 ? max : prev - 1));
  }, [activeProject]);

  const scrollToSection = useCallback((i) => {
    if (i < 0 || i > sections.length - 1) return;
    const section = document.getElementById(sections[i]);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIndex(i);
    }
  }, []);

  useEffect(() => {
    const root = mainStageRef.current;
    if (!root) return undefined;

    let rafId = 0;
    const syncNavToScroll = () => {
      rafId = 0;
      const rootRect = root.getBoundingClientRect();
      const targetY = rootRect.top + rootRect.height * 0.42;
      let best = 0;
      let bestDelta = Infinity;
      sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cy = r.top + r.height * 0.5;
        const d = Math.abs(cy - targetY);
        if (d < bestDelta) {
          bestDelta = d;
          best = i;
        }
      });
      setIndex((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(syncNavToScroll);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    syncNavToScroll();
    return () => {
      root.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const nodes = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (nodes.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const next = { ...prev };
          entries.forEach((entry) => {
            const id = entry.target.id;
            if (!sections.includes(id)) return;
            if (entry.intersectionRatio > 0.38) next[id] = true;
            else if (entry.intersectionRatio < 0.12) next[id] = false;
          });
          return next;
        });
      },
      { threshold: [0, 0.08, 0.12, 0.25, 0.38, 0.55, 0.72, 1], rootMargin: "-5% 0px -5% 0px" }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isScrolling = false;
    const handleWheel = (e) => {
      if (activeProject !== null) return;
      if (isScrolling) return;
      isScrolling = true;
      if (e.deltaY > 0) scrollToSection(index + 1);
      if (e.deltaY < 0) scrollToSection(index - 1);
      setTimeout(() => {
        isScrolling = false;
      }, 720);
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [index, scrollToSection, activeProject]);

  useEffect(() => {
    const onKey = (e) => {
      if (activeProject !== null) {
        if (e.key === "Escape") {
          e.preventDefault();
          closeProject();
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          nextSlide();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevSlide();
        }
        return;
      }
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        scrollToSection(index + 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToSection(index - 1);
      }
      if (e.key === "Home") {
        e.preventDefault();
        scrollToSection(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        scrollToSection(sections.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, scrollToSection, activeProject, nextSlide, prevSlide, closeProject]);

  useEffect(() => {
    if (activeProject === null) return undefined;
    const modal = modalRef.current;
    if (!modal) return undefined;

    const focusables = () =>
      Array.from(modal.querySelectorAll("button:not([disabled])")).filter(
        (el) => el.getAttribute("tabindex") !== "-1"
      );

    const onTab = (e) => {
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onTab);
    const t = requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      cancelAnimationFrame(t);
      document.removeEventListener("keydown", onTab);
    };
  }, [activeProject]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const modalOpen = activeProject !== null;
  const galleryLen = activeProject !== null ? projectImages[activeProject].length : 0;

  const onGalleryTouchStart = (e) => {
    const p = e.touches[0];
    touchRef.current = { x: p.clientX, y: p.clientY };
  };

  const onGalleryTouchEnd = (e) => {
    const t = touchRef.current;
    if (t.x == null) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - t.x;
    const dy = p.clientY - t.y;
    touchRef.current = { x: null, y: null };
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) nextSlide();
    else prevSlide();
  };

  return (
    <div className={modalOpen ? "appRoot appRoot--modalOpen" : "appRoot"}>
      <a href="#main-content" className="skipLink">
        Skip to main content
      </a>
      <video
        ref={videoRef}
        className="videoBg"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      >
        <source src={starVideo} type="video/mp4" />
      </video>

      <div className="videoOverlay videoOverlay--vignette" aria-hidden />
      <div className="videoOverlay videoOverlay--gradient" aria-hidden />
      <div className="videoOverlay videoOverlay--grain" aria-hidden />

      <nav className="sidebar" aria-label="Section navigation">
        <ul className="navList">
          {sections.map((id, i) => (
            <li key={id}>
              <button
                type="button"
                className={`navItem ${index === i ? "navItem--active" : ""}`}
                onClick={() => scrollToSection(i)}
                aria-current={index === i ? "true" : undefined}
              >
                <span className="navItemIndex">0{i + 1}</span>
                <span className="navItemLabel">{navLabels[i]}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main id="main-content" ref={mainStageRef} className="mainStage" tabIndex={-1}>
        <section
          id="intro"
          className={`section section--intro ${visibleSections.intro ? "is-visible" : ""}`}
        >
          <div className="sectionGlow sectionGlow--intro" aria-hidden />
          <div className="sectionInner sectionInner--fromLeft">
            <p className="eyebrow">Welcome</p>
            <div className="introText">
              <h1>Hi, James here!</h1>
              <p className="introRole">Junior Software Engineer</p>
            </div>
            <div className="introButtonCont">
              <button
                type="button"
                className="pillButton"
                onClick={() => scrollToSection(1)}
                aria-label="Scroll to About"
              >
                <span className="pillButtonLabel">Explore</span>
                <span className="arrowDown" aria-hidden />
              </button>
            </div>
          </div>
        </section>

        <section
          id="about"
          className={`section section--about ${visibleSections.about ? "is-visible" : ""}`}
        >
          <div className="sectionGlow sectionGlow--about" aria-hidden />
          <div className="smoke" aria-hidden />
          <div className="sectionInner sectionInner--fromRight aboutContent">
            <div className="aboutHeader glassCard glassCard--hero">
              <h2>About</h2>
              <p>
                I enjoy interactive web development and modern UI experiences using Cursor and GPT :D
              </p>
            </div>
            <div className="infoGrid">
              <div className="glassCard glassCard--tile">
                <h3>Socials</h3>
                <p>FB: Kael Dthas</p>
                <p>IG: Dthas Kael</p>
              </div>
              <div className="glassCard glassCard--tile">
                <h3>Email</h3>
                <p>jamesvienne05@gmail.com</p>
              </div>
              <div className="glassCard glassCard--tile">
                <h3>Stack</h3>
                <p>React • Vite • MongoDB</p>
              </div>
            </div>
            <div className="aboutButtonCont">
              <button
                type="button"
                className="pillButton"
                onClick={() => scrollToSection(2)}
                aria-label="Scroll to Projects"
              >
                <span className="pillButtonLabel">Projects</span>
                <span className="arrowDown" aria-hidden />
              </button>
            </div>
          </div>
        </section>

        <section
          id="portfolio"
          className={`section section--portfolio ${visibleSections.portfolio ? "is-visible" : ""}`}
        >
          <div className="sectionGlow sectionGlow--portfolio" aria-hidden />
          <div className="sectionInner sectionInner--fromBottom portfolioLayout">
            <header className="portfolioHeader">
              <p className="eyebrow">Interactive Web Apps</p>
              <h2 className="portfolioTitle">Projects</h2>
            </header>
            <div className="projectGrid">
              <button
                type="button"
                className="projectCard"
                onClick={() => openProject(0)}
                aria-label={`Open ${projectTitles[0]} image gallery`}
              >
                <span className="projectCardShine" aria-hidden />
                <h3>Blog Website</h3>
                <p>Personal blog website with authentication and user post management.</p>
                <div className="techPopup">
                  <p>Vue • Axios • Node • Express • MongoDB • JWT • REST API • Vite</p>
                </div>
              </button>
              <button
                type="button"
                className="projectCard"
                onClick={() => openProject(1)}
                aria-label={`Open ${projectTitles[1]} image gallery`}
              >
                <span className="projectCardShine" aria-hidden />
                <h3>Product Showcase</h3>
                <p>Frontend-focused carousel and UI transitions.</p>
                <div className="techPopup">
                  <p>React • JavaScript • HTML • CSS</p>
                </div>
              </button>
              <button
                type="button"
                className="projectCard"
                onClick={() => openProject(2)}
                aria-label={`Open ${projectTitles[2]} image gallery`}
              >
                <span className="projectCardShine" aria-hidden />
                <h3>Tamarind Leaf Detection</h3>
                <p>TensorFlow image detection with Ionic cross-platform app.</p>
                <div className="techPopup">
                  <p>Vue • Ionic • TensorFlow • SQLite • Capacitor</p>
                </div>
              </button>
            </div>
          </div>

          {activeProject !== null && (
            <div
              ref={modalRef}
              className="carouselModal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-dialog-title"
            >
              <button
                type="button"
                className="carouselModalBackdrop"
                onClick={closeProject}
                tabIndex={-1}
                aria-hidden="true"
              />
              <div
                className="carouselModalShell"
                onTouchStart={onGalleryTouchStart}
                onTouchEnd={onGalleryTouchEnd}
              >
                <div className="carouselModalTop">
                  <span className="carouselCounter" aria-hidden="true">
                    {slideIndex + 1} / {galleryLen}
                  </span>
                  <h2 id="gallery-dialog-title" className="carouselModalTitle">
                    {projectTitles[activeProject]}
                  </h2>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    className="closeBtn"
                    onClick={closeProject}
                    aria-label="Close gallery"
                  >
                    ✕
                  </button>
                </div>
                <p className="visuallyHidden" aria-live="polite" aria-atomic="true">
                  Image {slideIndex + 1} of {galleryLen}
                </p>
                <button
                  type="button"
                  className="navBtn left"
                  onClick={prevSlide}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="navBtn right"
                  onClick={nextSlide}
                  aria-label="Next image"
                >
                  ›
                </button>
                <div className="carouselStack">
                  {projectImages[activeProject].map((img, i) => {
                    const len = projectImages[activeProject].length;
                    const role = carouselSlideRole(i, slideIndex, len);
                    return (
                      <div
                        key={`${activeProject}-${i}-${img}`}
                        className={`carouselSlide carouselSlide--${role}`}
                        aria-hidden={role !== "active"}
                      >
                        <div className="carouselSlideFrame">
                          <img
                            src={img}
                            alt={`${projectTitles[activeProject]} screenshot ${i + 1} of ${len}`}
                            draggable={false}
                            decoding="async"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {galleryLen > 1 && (
                  <div className="carouselDots" role="group" aria-label="Jump to image">
                    {projectImages[activeProject].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-pressed={i === slideIndex}
                        aria-label={`Show image ${i + 1} of ${galleryLen}`}
                        className={`carouselDot ${i === slideIndex ? "carouselDot--active" : ""}`}
                        onClick={() => setSlideIndex(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
