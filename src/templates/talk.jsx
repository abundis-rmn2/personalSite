import React from 'react';
import { graphql } from 'gatsby';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, x: -500 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, x: 500, transition: { duration: 0.6 } }
};


const TalkTemplate = ({ data }) => {
    const talk = data.wpTalk;

    return (
        <motion.div
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                    >
        <div>
            <h1>{talk.title}</h1>
            <p>{talk.abstract}</p>
        </div>
        </motion.div>
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