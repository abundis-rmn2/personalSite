// src/components/MediaList.jsx
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Link } from 'gatsby';

const MediaAppareancesList = () => {
    const data = useStaticQuery(graphql`
        query {
            allWpMediaAppearance {
                nodes {
                    id
                    title
                    slug
                }
            }
        }
    `);

    const mediaAppearances = data.allWpMediaAppearance.nodes;

    return (
        <div>
            <h1>Media Appearances</h1>
            <ul>
                {mediaAppearances.map((appearance) => (
                    <li key={appearance.id}>
                        <Link to={`/mediaAppearance/${appearance.slug}`}>{appearance.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MediaAppareancesList;