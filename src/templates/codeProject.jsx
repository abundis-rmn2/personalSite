import React from 'react';
import { graphql } from 'gatsby';

const CodeProjectTemplate = ({ data }) => {
    const codeProject = data.wpCodeProject;

    return (
        <div>
            <h1>{codeProject.title}</h1>
        </div>
    );
};

export const query = graphql`
    query($id: String!) {
        wpCodeProject(id: { eq: $id }) {
            id
            title
        }
    }
`;

export default CodeProjectTemplate;
