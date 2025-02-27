import React, { useState, useEffect, useRef } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import ThesisList from '../components/ThesisList';
import ArticleList from '../components/ArticleList';
import TalkList from '../components/TalkList';
import CodeProjectsList from '../components/CodeProjectsList';
import MultimediaList from '../components/MultimediaList';
import MediaAppareancesList from '../components/MediaAppareancesList';
import GlobalList from '../components/GlobalList';
import Header from '../components/header';
import AnchorMenu from '../components/anchor';
import NetworkGraph from '../components/NetworkGraph';
import '../styles/global.css';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState("thesis");
  const lenis = useLenis(); // ✅ Get Lenis instance
  const networkGraphRef = useRef(null);

  const sections = [
    { id: "Bio", label: "Bio" },
    { id: "thesis", label: "Thesis" },
    { id: "articles", label: "Articles" },
    { id: "talks", label: "Talks" },
    { id: "code", label: "Code" },
    { id: "multimedia", label: "Multimedia" },
    { id: "media", label: "Media" },
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      const currentIndex = sections.findIndex((s) => s.id === activeSection);
      let nextIndex = currentIndex;

      if (event.key === "ArrowDown" && currentIndex < sections.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (event.key === "ArrowUp" && currentIndex > 0) {
        nextIndex = currentIndex - 1;
      }

      if (nextIndex !== currentIndex) {
        lenis?.scrollTo(`#${sections[nextIndex].id}`); // ✅ Use Lenis instance
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection, lenis]);

  useLenis(({ scroll }) => {
    let currentSection = "";
    //console.log(scroll)
    let fullDocumentHeight = document.documentElement.scrollHeight;
    let fullWindowHeight = window.innerHeight;
    //console.log(fullDocumentHeight - fullWindowHeight)

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
          currentSection = id;
        }
      }
    });

    setActiveSection(currentSection);

    // Apply effect on NetworkGraph
    if (networkGraphRef.current) {
      networkGraphRef.current.applyEffect();
    }
  });

  const handleSetCameraPosition = () => {
    if (networkGraphRef.current) {
      networkGraphRef.current.setCameraPosition(100, 5, 2); // Move camera
    }
  };

  const handleRotateGraph = () => {
    if (networkGraphRef.current) {
      networkGraphRef.current.rotateGraph(2221.0); // Rotate graph
    }
  };

  const handleResizeGraph = () => {
    if (networkGraphRef.current) {
      networkGraphRef.current.resizeGraph(800, 600); // Resize canvas
    }
  };

  const handleZoomToFit = () => {
    if (networkGraphRef.current) {
      networkGraphRef.current.zoomToFit(); // Zoom to fit
    }
  };

  const handleZoomToID = (id) => {
    if (networkGraphRef.current) {
      console.log("index.js", id)
      networkGraphRef.current.zoomToID(id); // Zoom to node
      networkGraphRef.current.highlightIDCall(id); // Highlight node
    }
  }

  return (
    <ReactLenis root>
      {/* Fixed background */}
      <div className="global-background">
        <GlobalList ref={networkGraphRef} />
      </div>
      
      <Header sections={sections} activeSection={activeSection} />
      <AnchorMenu 
          sections={sections} 
          activeSection={activeSection} 
          networkGraphRef={networkGraphRef} 
        />
      <div className="controls" style={{ position: "fixed", top: 100, right: 0, zIndex: 100 }}>
        <button onClick={handleSetCameraPosition}>Set Camera Position</button>
        <button onClick={handleRotateGraph}>Rotate Graph</button>
        <button onClick={handleResizeGraph}>Resize Graph</button>
        <button onClick={handleZoomToFit}>Zoom to Fit</button>
        <button onClick={() => handleZoomToID(54)}>Zoom to Article 54</button>
      </div>

      {/* Smooth scrolling content */}
      <div className="content">
        {sections.map(({ id }) => (
          <section key={id} id={id}>
            {id === "Bio" && <h1>Biography</h1>}
            {id === "thesis" && <ThesisList />}
            {id === "articles" && <ArticleList />}
            {id === "talks" && <TalkList />}
            {id === "code" && <CodeProjectsList />}
            {id === "multimedia" && <MultimediaList />}
            {id === "media" && <MediaAppareancesList />}
          </section>
        ))}
      </div>
      <NetworkGraph posts={[]} />
    </ReactLenis>
  );
};

export default HomePage;
