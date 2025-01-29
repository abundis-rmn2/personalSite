import React from 'react';
import { graphql } from 'gatsby';

const MultimediaTemplate = ({ data }) => {
    const multimediaItem = data.wpMultimediaItem;

    return (
        <div>
            <h1>{multimediaItem.title}</h1>
        </div>
    );
};

export const query = graphql`
    query($id: String!) {
        wpMultimediaItem(id: { eq: $id }) {
            id
            title
        }
    }
`;

export default MultimediaTemplate;
