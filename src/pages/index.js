import React, { useState, useEffect, useRef } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import ThesisList from '../components/ThesisList';
import ArticleList from '../components/ArticleList';
import TalkList from '../components/TalkList';
import CodeProjectsList from '../components/CodeProjectsList';
import MultimediaList from '../components/MultimediaList';
import MediaAppareancesList from '../components/MediaAppareancesList';
import GlobalList from '../components/GlobalList';
import AnchorMenu from '../components/anchor';
import Bio from '../components/Bio';
import { motion } from 'framer-motion';
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

  const pageVariants = {
    initial: { opacity: 0, x: -500 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, x: 500, transition: { duration: 0.6 } }
};

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

  return (

    <ReactLenis root>
          <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
  >
      {/* Fixed background */}
      <div className="global-background">
        <GlobalList ref={networkGraphRef} />
      </div>
      
      <AnchorMenu 
          sections={sections} 
          activeSection={activeSection} 
          networkGraphRef={networkGraphRef} 
        />

      {/* Smooth scrolling content */}
      <div className="content">
        {sections.map(({ id }) => (
          <div className="wrapper" key={id} id={id}>
            {id === "Bio" && <Bio />}
            {id === "thesis" && <ThesisList />}
            {id === "articles" && <ArticleList />}
            {id === "talks" && <TalkList />}
            {id === "code" && <CodeProjectsList />}
            {id === "multimedia" && <MultimediaList />}
            {id === "media" && <MediaAppareancesList />}
          </div>
        ))}
      </div>
      </motion.div>
    </ReactLenis>
  );
};

export default HomePage;
