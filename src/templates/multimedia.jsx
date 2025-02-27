import React from 'react';
import { graphql } from 'gatsby';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, x: -500 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, x: 500, transition: { duration: 0.6 } }
};

const MultimediaTemplate = ({ data }) => {
    const multimediaItem = data.wpMultimediaItem;

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            <h1>{multimediaItem.title}</h1>
        </motion.div>
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
