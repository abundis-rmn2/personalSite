import React from "react";
import { AnchorLink } from "gatsby-plugin-anchor-links";

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
            networkGraphRef.current.highlightIDCall(sectionToNodeMap[id])
        }
    };

    return (
        <div className="anchor-nav">
            {sections.map(({ id, label }) => (
                <div key={id} className="anchor-item">
                    <AnchorLink
                        to={`/#${id}`}
                        className={`dot ${activeSection === id ? "active" : ""}`}
                        title={label}
                        onAnchorLinkClick={(e) => handleAnchorClick(e, id)}
                    >
                        <div className="circle">
                            <span className="label">{label}</span>
                        </div>
                    </AnchorLink>
                </div>
            ))}
        </div>
    );
};

export default AnchorMenu;