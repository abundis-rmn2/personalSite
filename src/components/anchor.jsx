import React from "react";
import { AnchorLink } from "gatsby-plugin-anchor-links";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const AnchorMenu = ({ sections, activeSection, networkGraphRef }) => {
    // Map section names to node IDs in the graph
    const sectionToNodeMap = {
        "Bio": 1,
        "thesis": 32, 
        "articles": 54,
        "talks": 105,
        "code": 54,
        "multimedia": 73,
        "media": 98
    };

    const handleAnchorClick = async (e, id) => {
        // If we have a network graph reference and a mapping for this section
        if (networkGraphRef?.current && sectionToNodeMap[id]) {
            // Call the zoomToID method with the mapped node ID
            networkGraphRef.current.zoomToID(sectionToNodeMap[id]);
            networkGraphRef.current.highlightIDCall(sectionToNodeMap[id]);
        }
        // Update the URL hash
       // window.location.hash = `#${id}`;
    };

    return (
        <div className="anchor-nav">
            {sections.map(({ id, label }) => (
                <AnchorLink
                    key={id}
                    to={`#${id}`}
                    className={`dot ${activeSection === id ? "active" : ""}`}
                    title={label}
                    onAnchorLinkClick={(e) => handleAnchorClick(e, id)}
                    stripHash={false}
                >
                </AnchorLink>
            ))}
            <div className="socials">
                <a href="https://github.com/abundis-rmn2" target="_blank" rel="noreferrer">
                    <FaGithub size={32} />
                </a>
                <a href="https://www.linkedin.com/in/abundis-sociologia/" target="_blank" rel="noreferrer">
                    <FaLinkedin size={32} />
                </a>
            </div>
        </div>
    );
};

export default AnchorMenu;