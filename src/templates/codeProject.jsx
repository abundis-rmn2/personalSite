import React from 'react';
import { graphql } from 'gatsby';

const CodeProjectTemplate = ({ data }) => {
    const codeProject = data.wpCodeProject;

    return (
        <div>
            <h1>{codeProject.title}</h1>
            
            <p><strong>Project URL:</strong> {codeProject.projectUrl}</p>
            <p><strong>GitHub Repo:</strong> {codeProject.githubRepo}</p>
            <p><strong>Abstract:</strong> {codeProject.abstract}</p>
            <p><strong>Display Date:</strong> {codeProject.displayDate}</p>
            
            <div dangerouslySetInnerHTML={{ __html: codeProject.content }} />
        </div>
    );
};

export const query = graphql`
    query($id: String!) {
        wpCodeProject(id: { eq: $id }) {
            id
            title
            content
            projectUrl
            githubRepo
            abstract
            displayDate
        }
    }
`;

export default CodeProjectTemplate;