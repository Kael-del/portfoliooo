import React, { useState, useEffect } from "react";
import "./App.css";
import starVideo from "./starry sky loop.mp4";

function App() {

  const sections = ["intro", "about", "portfolio"];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  // ✅ MOVED OUT (was inside scrollToSection)
  const projectImages = [
    ["/img/6.jpg", "/img/7.jpg","/img/8.jpg","/img/9.jpg","/img/10.jpg","/img/11.jpg","/img/12.jpg"],
    ["/img/1.jpg", "/img/2.jpg", "/img/3.jpg", "/img/4.jpg", "/img/5.jpg"],
    ["/img/13.jpg", "/img/14.jpg", "/img/15.jpg", "/img/16.jpg","/img/17.jpg","/img/18.jpg","/img/19.jpg"]
  ];

  // ✅ MOVED OUT (was inside scrollToSection)
  const openProject = (i) => {
    setActiveProject(i);
    setSlideIndex(0);
  };

  const closeProject = () => {
    setActiveProject(null);
  };

  const nextSlide = () => {
    const max = projectImages[activeProject].length - 1;
    setSlideIndex((prev) => (prev === max ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const max = projectImages[activeProject].length - 1;
    setSlideIndex((prev) => (prev === 0 ? max : prev - 1));
  };

  const scrollToSection = (i) => {

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
  };

  useEffect(() => {

    const handleWheel = (e) => {

      if (e.deltaY > 0) {
        scrollToSection(index + 1);
      }

      if (e.deltaY < 0) {
        scrollToSection(index - 1);
      }

    };

    window.addEventListener("wheel", handleWheel);

    return () => window.removeEventListener("wheel", handleWheel);

  }, [index]);

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
          // Name
        </div>

        <div
          className={index === 1 ? "navItem active" : "navItem"}
          onClick={() => scrollToSection(1)}
        >
          // About
        </div>

        <div
          className={index === 2 ? "navItem active" : "navItem"}
          onClick={() => scrollToSection(2)}
        >
          // Projects
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
            onClick={() => scrollToSection(1)}>
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
                <p>React • Vite • MonggoDB</p>
              </div>

            </div>

          </div>

            <div className="aboutButtonCont">
              <button 
              className="aboutButton"
              onClick={() => scrollToSection(2)}>
              <div className="arrowDown"></div>
              </button>
            </div>

        </section>

        <section id="portfolio" className="section portfolioSection">

          <h2 className="portfolioTitle">Projects</h2>

          <div className="projectGrid">

            <div className="projectCard" onClick={() => openProject(0)}>
              <h3>Blog Website</h3>
              <p>Personal blog website with password authentication and individual user post management.</p>

              <div className="techPopup">
                <p>Vue • Axios • Node.js • Express • MongoDB • JWT Authentication • REST API • CSS3 • 
                  HTML5 • Vite • SPA Architecture</p>
              </div>
            </div>

            <div className="projectCard" onClick={() => openProject(1)}>
              <h3>Product Showcase Website</h3>
              <p>Product showcase website. Purely frontend. Focused on utilizing carousel transitions.</p>

              <div className="techPopup">
                <p>React • JavaScript • HTML5 • CSS • React Icons </p>
              </div>
            </div>

            <div className="projectCard" onClick={() => openProject(2)}>
              <h3>Android Based Tamarind Leaf Disease Detection</h3>
              <p>Utiliziation of TensorFlow for image processing. Ionic for crossplatform compatibility.</p>

              <div className="techPopup">
                <p>Vue • Ionic Vue • TypeScript • Vite •  Capacitor (Camera API) • TensorFlow (Teachable Machine Image Model) 
                  • SQLite (Capacitor Community SQLite) • Bootstrap • JavaScript (ES Modules)</p>
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