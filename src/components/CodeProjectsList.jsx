// src/components/CodeProjectsList.jsx
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Link } from 'gatsby';

const CodeProjectsList = () => {
    const data = useStaticQuery(graphql`
        query {
            allWpCodeProject {
                nodes {
                    id
                    title
                    slug
                }
            }
        }
    `);

    const codeProjects = data.allWpCodeProject.nodes;

    return (
        <div>
            <h1>Code Projects</h1>
            <ul>
                {codeProjects.map((project) => (
                    <li key={project.id}>
                        <Link to={`/codeProject/${project.slug}`}>{project.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CodeProjectsList;