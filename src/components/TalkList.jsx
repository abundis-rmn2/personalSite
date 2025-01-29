// src/components/TalkList.jsx
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Link } from 'gatsby';

const TalkList = () => {
    const data = useStaticQuery(graphql`
        query {
            allWpTalk {
                nodes {
                    id
                    title
                    slug
                }
            }
        }
    `);

    const talks = data.allWpTalk.nodes;

    return (
        <div>
            <h1>Talks</h1>
            <ul>
                {talks.map((talk) => (
                    <li key={talk.id}>
                        <Link to={`/conference/${talk.slug}`}>{talk.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TalkList;