// src/templates/article.jsx
import React from 'react';
import { graphql } from 'gatsby';

const ArticleTemplate = ({ data }) => {
    const article = data.wpArticle;

    return (
        <div>
            <h1>{article.title}</h1>
            <p>{article.abstract}</p>
            <a href={article.paperUrl}>Read the paper</a>
        </div>
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