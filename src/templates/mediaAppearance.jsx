import React from 'react';
import { graphql } from 'gatsby';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, x: -500 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, x: 500, transition: { duration: 0.6 } }
};


const MediaAppearanceTemplate = ({ data }) => {
    const mediaAppearance = data.wpMediaAppearance;

    return (
        <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
    >
        <div>
            <h1>{mediaAppearance.title}</h1>
            <p>{mediaAppearance.mediaUrl}</p>
            <p>{mediaAppearance.abstract}</p>
        </div>
        </motion.div>
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
