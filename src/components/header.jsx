import React, { useState, useEffect } from "react";
import { AnchorLink } from "gatsby-plugin-anchor-links";
import { useLenis } from "lenis/react";

const Header = ({ sections, activeSection }) => {

  useLenis(({ scroll }) => {
    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) {
        const rect = section.getBoundingClientRect();
      }
    });
  });

  if (!sections) {
    return null;
  }

  console.log(sections)
  return (
    <header className="header">
      <nav>
        <ul>
          {sections.map(({ id, label }) => (
            <li key={id}>
              <AnchorLink
                to={`/#${id}`}
                className={activeSection === id ? "active" : ""}
                title={label}
              >
                {label}
              </AnchorLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
