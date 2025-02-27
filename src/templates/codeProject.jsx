import React from 'react';
import { graphql } from 'gatsby';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, x: -500 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, x: 500, transition: { duration: 0.6 } }
};

const CodeProjectTemplate = ({ data }) => {
    const codeProject = data.wpCodeProject;

    return (
        <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
    >
        <div>
            <h1>{codeProject.title}</h1>
            
            <p><strong>Project URL:</strong> {codeProject.projectUrl}</p>
            <p><strong>GitHub Repo:</strong> {codeProject.githubRepo}</p>
            <p><strong>Abstract:</strong> {codeProject.abstract}</p>
            <p><strong>Display Date:</strong> {codeProject.displayDate}</p>
            
            <div dangerouslySetInnerHTML={{ __html: codeProject.content }} />
        </div>
        </motion.div>
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