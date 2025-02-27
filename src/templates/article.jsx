import React from 'react';
import { graphql } from 'gatsby';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, x: -500 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, x: 500, transition: { duration: 0.6 } }
};

const ArticleTemplate = ({ data }) => {
    const article = data.wpArticle;

    return (        
    <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
            >
        <div>
            <h1>{article.title}</h1>
            <p>{article.abstract}</p>
            <a href={article.paperUrl}>Read the paper</a>
        </div>
         </motion.div>
    );
};

export const query = graphql`
    query($id: String!) {
        wpArticle(id: { eq: $id }) {
            id
            title
            abstract
            paperUrl
        }
    }
`;

export default ArticleTemplate;