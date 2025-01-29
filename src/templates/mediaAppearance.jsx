import React from 'react';
import { graphql } from 'gatsby';

const MediaAppearanceTemplate = ({ data }) => {
    const mediaAppearance = data.wpMediaAppearance;

    return (
        <div>
            <h1>{mediaAppearance.title}</h1>
            <p>{mediaAppearance.mediaUrl}</p>
            <p>{mediaAppearance.abstract}</p>
        </div>
    );
};

export const query = graphql`
    query($id: String!) {
        wpMediaAppearance(id: { eq: $id }) {
            id
            title
            mediaUrl
            abstract
        }
    }
`;

export default MediaAppearanceTemplate;
