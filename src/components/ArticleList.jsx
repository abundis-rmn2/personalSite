// src/components/ArticleList.jsx
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Link } from 'gatsby';

const ArticleList = () => {
    const data = useStaticQuery(graphql`
        query {
            allWpArticle {
                nodes {
                    id
                    title
                    slug
                    abstract
                }
            }
        }
    `);

    const articles = data.allWpArticle.nodes;

    return (
        <div>
            <h1>Articles</h1>
            <ul>
                {articles.map((article) => (
                    <li key={article.id}>
                        <Link to={`/paper/${article.slug}`}>{article.title} - <span>{article.abstract}</span></Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArticleList;