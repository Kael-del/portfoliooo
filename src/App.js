import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import starVideo from "./starry-sky-loop.mp4";

// ✅ move outside (stable)
const sections = ["intro", "about", "portfolio"];

function App() {

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const projectImages = [
    ["/img/6.jpg", "/img/7.jpg","/img/8.jpg","/img/9.jpg","/img/10.jpg","/img/11.jpg","/img/12.jpg"],
    ["/img/1.jpg", "/img/2.jpg", "/img/3.jpg", "/img/4.jpg", "/img/5.jpg"],
    ["/img/13.jpg", "/img/14.jpg", "/img/15.jpg", "/img/16.jpg","/img/17.jpg","/img/18.jpg","/img/19.jpg"]
  ];

  const openProject = (i) => {
    setActiveProject(i);
    setSlideIndex(0);
  };

  const closeProject = () => {
    setActiveProject(null);
  };

  // ✅ SAFE next
  const nextSlide = () => {
    if (activeProject === null) return;
    const max = projectImages[activeProject].length - 1;
    setSlideIndex((prev) => (prev === max ? 0 : prev + 1));
  };

  // ✅ FIXED (moved outside useEffect)
  const prevSlide = () => {
    if (activeProject === null) return;
    const max = projectImages[activeProject].length - 1;
    setSlideIndex((prev) => (prev === 0 ? max : prev - 1));
  };

  const scrollToSection = useCallback((i) => {

    if (i < 0 || i > sections.length - 1) return;

    const section = document.getElementById(sections[i]);

    if (section) {
      setAnimate(true);

      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth" });
        setIndex(i);
        setAnimate(false);
      }, 200);
    }

  }, []);

  // ✅ smoother scroll (throttled)
  useEffect(() => {

    let isScrolling = false;

    const handleWheel = (e) => {
      if (isScrolling) return;

      isScrolling = true;

      if (e.deltaY > 0) scrollToSection(index + 1);
      if (e.deltaY < 0) scrollToSection(index - 1);

      setTimeout(() => {
        isScrolling = false;
      }, 700);
    };

    window.addEventListener("wheel", handleWheel);

    return () => window.removeEventListener("wheel", handleWheel);

  }, [index, scrollToSection]);

  return (

    <div className="container">

      {/* VIDEO BACKGROUND */}
      <video className="videoBg" autoPlay loop muted playsInline>
        <source src={starVideo} type="video/mp4" />
      </video>

      <nav className="sidebar">

        <div
          className={index === 0 ? "navItem active" : "navItem"}
          onClick={() => scrollToSection(0)}
        >
          || Name
        </div>

        <div
          className={index === 1 ? "navItem active" : "navItem"}
          onClick={() => scrollToSection(1)}
        >
          || About
        </div>

        <div
          className={index === 2 ? "navItem active" : "navItem"}
          onClick={() => scrollToSection(2)}
        >
          || Projects
        </div>

      </nav>

      <main className={animate ? "fadeTransition" : ""}>

        <section id="intro" className="section introSection">

          <div className="introText">
            <h1>Hi, James here!</h1>
            <p>Junior Software Engineer</p>
          </div>

          <div className="introButtonCont">
            <button
              className="introButton"
              onClick={() => scrollToSection(1)}
            >
              <div className="arrowDown"></div>
            </button>
          </div>

        </section>

        <section id="about" className="section aboutSection">

          <div className="smoke"></div>

          <div className="aboutContent">

            <div className="glassCard">
              <h2>About</h2>
              <p>
                I enjoy interactive web development and modern
                UI experiences using React and backend tools.
              </p>
            </div>

            <div className="infoGrid">

              <div className="glassCard">
                <h3>Socials</h3>
                <p>FB: Kael Dthas</p>
                <p>IG: Dthas Kael</p>
              </div>

              <div className="glassCard">
                <h3>Location</h3>
                <p>Pampanga, Philippines</p>
              </div>

              <div className="glassCard">
                <h3>Stack Specialty</h3>
                <p>React • Vite • MongoDB</p>
              </div>

            </div>

          </div>

          <div className="aboutButtonCont">
            <button
              className="aboutButton"
              onClick={() => scrollToSection(2)}
            >
              <div className="arrowDown"></div>
            </button>
          </div>

        </section>

        <section id="portfolio" className="section portfolioSection">

          <h2 className="portfolioTitle">Projects</h2>

          <div className="projectGrid">

            <div className="projectCard" onClick={() => openProject(0)}>
              <h3>Blog Website</h3>
              <p>Personal blog website with authentication and user post management.</p>
              <div className="techPopup">
                <p>Vue • Axios • Node • Express • MongoDB • JWT • REST API • Vite</p>
              </div>
            </div>

            <div className="projectCard" onClick={() => openProject(1)}>
              <h3>Product Showcase</h3>
              <p>Frontend-focused carousel and UI transitions.</p>
              <div className="techPopup">
                <p>React • JavaScript • HTML • CSS</p>
              </div>
            </div>

            <div className="projectCard" onClick={() => openProject(2)}>
              <h3>Tamarind Leaf Detection</h3>
              <p>TensorFlow image detection with Ionic cross-platform.</p>
              <div className="techPopup">
                <p>Vue • Ionic • TensorFlow • SQLite • Capacitor</p>
              </div>
            </div>

          </div>

          {activeProject !== null && (
            <div className="carouselModal">

              <button className="closeBtn" onClick={closeProject}>✕</button>

              <button className="navBtn left" onClick={prevSlide}>‹</button>
              <button className="navBtn right" onClick={nextSlide}>›</button>

              <div
                className="carouselTrack"
                style={{
                  transform: `translateX(-${slideIndex * 100}%)`
                }}
              >
                {projectImages[activeProject].map((img, i) => (
                  <div className="slide" key={i}>
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>

            </div>
          )}

        </section>

      </main>

    </div>

  );
}

export default App;