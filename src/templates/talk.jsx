// src/templates/article.jsx
import React from 'react';
import { graphql } from 'gatsby';

const TalkTemplate = ({ data }) => {
    const talk = data.wpTalk;

    return (
        <div>
            <h1>{talk.title}</h1>
            <p>{talk.abstract}</p>

        </div>
    );
};

export const query = graphql`
    query($id: String!) {
        wpTalk(id: { eq: $id }) {
            id
            title
            abstract
        }
    }
`;

export default TalkTemplate;