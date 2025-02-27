import React, { useEffect, useRef } from 'react';
import { graphql } from 'gatsby';
import { motion } from 'framer-motion';
import GlobalList from '../components/GlobalList';
import '../styles/global.css';

const pageVariants = {
    initial: { opacity: 0, x: -500 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, x: 500, transition: { duration: 0.6 } }
};

const ThesisTemplate = ({ data }) => {
    const { wpThesis: thesis } = data;
    const networkGraphRef = useRef(null);

    const cleanDatabaseId = parseInt(atob(thesis.id).replace('post:', ''), 10);
    
    useEffect(() => {
        if (!cleanDatabaseId || !networkGraphRef.current) return;
        
        
        networkGraphRef.current.highlightIDCall(cleanDatabaseId);
        setTimeout(() => {
            networkGraphRef.current.zoomToID(cleanDatabaseId);
        }, 1000);
    }, []);

    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
            <div>
                <h1>{thesis.title} - {thesis.id} - {cleanDatabaseId}</h1>
                <p>{thesis.abstract}</p>
            </div>
            <div style={{ border: '10px solid black' }} className="global-background">
                <GlobalList style={{ border: '10px solid black' }} ref={networkGraphRef} />
            </div>
        </motion.div>
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
