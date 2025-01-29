// src/components/MultimediaList.jsx
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Link } from 'gatsby';

const MultimediaList = () => {
    const data = useStaticQuery(graphql`
        query {
            allWpMultimediaItem {
                nodes {
                    id
                    title
                    slug
                }
            }
        }
    `);

    const multimediaItems = data.allWpMultimediaItem.nodes;

    return (
        <div>
            <h1>Multimedia Items</h1>
            <ul>
                {multimediaItems.map((item) => (
                    <li key={item.id}>
                        <Link to={`/multimediaProject/${item.slug}`}>{item.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MultimediaList;