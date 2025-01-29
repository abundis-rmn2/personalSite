// src/components/ThesisList.jsx
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Link } from 'gatsby';

const ThesisList = () => {
    const data = useStaticQuery(graphql`
        query {
            allWpThesis {
                nodes {
                    id
                    title
                    slug
                }
            }
        }
    `);

    const theses = data.allWpThesis.nodes;

    return (
        <div>
            <h1>Theses</h1>
            <ul>
                {theses.map((thesis) => (
                    <li key={thesis.id}>
                        <Link to={`/thesis/${thesis.slug}`}>{thesis.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThesisList;