// src/templates/thesis.jsx
import React from 'react';
import { graphql } from 'gatsby';

const ThesisTemplate = ({ data }) => {
    const thesis = data.wpThesis;

    return (
        <div>
            <h1>{thesis.title}</h1>
            <p>{thesis.abstract}</p>
        </div>
    );
};

export const query = graphql`
    query($id: String!) {
        wpThesis(id: { eq: $id }) {
            id
            title
            abstract
        }
    }
`;

export default ThesisTemplate;
