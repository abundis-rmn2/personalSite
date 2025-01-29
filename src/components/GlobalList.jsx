import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Link } from 'gatsby';

const GlobalList = () => {
    const data = useStaticQuery(graphql`
        query {
            allWpPost {
                nodes {
                    id
                    title
                    slug
                    abstract
                    relatedPosts {
                        id
                        title
                        slug
                    }
                }
            }
            allWpCodeProjects: allWpCodeProject {
                nodes {
                    id
                    title
                    slug
                    abstract
                    relatedPosts {
                        id
                        title
                        slug
                    }
                }
            }
            allWpTalks: allWpTalk {
                nodes {
                    id
                    title
                    slug
                    abstract
                    relatedPosts {
                        id
                        title
                        slug
                    }
                }
            }
            allWpArticles: allWpArticle {
                nodes {
                    id
                    title
                    slug
                    abstract
                    relatedPosts {
                        id
                        title
                        slug
                    }
                }
            }
            allWpMultimediaItem: allWpMultimediaItem {
                nodes {
                    id
                    title
                    slug
                    abstract
                    relatedPosts {
                        id
                        title
                        slug
                    }
                }
            }
            allWpMediaAppearances: allWpMediaAppearance {
                nodes {
                    id
                    title
                    slug
                    abstract
                    relatedPosts {
                        id
                        title
                        slug
                    }
                }
            }
            allWpThesis: allWpThesis {
                nodes {
                    id
                    title
                    slug
                    abstract
                    relatedPosts {
                        id
                        title
                        slug
                    }
                }
            }
        }
    `);

    // Combine all post types into a single list
    const allPosts = [
        ...data.allWpPost.nodes,
        ...data.allWpCodeProjects.nodes,
        ...data.allWpTalks.nodes,
        ...data.allWpArticles.nodes,
        ...data.allWpMultimediaItem.nodes,
        ...data.allWpMediaAppearances.nodes,
        ...data.allWpThesis.nodes
    ];

    return (
        <div>
            <h1>All Posts & Custom Post Types</h1>
            <ul>
                {allPosts.map((post) => (
                    <li key={post.id}>
                        <Link to={`/post/${post.slug}`}>{post.title}</Link>
                        {console.log(post)}
                        <span> Related</span>
                        {/* Related Posts Section */}
                        {post.relatedPosts && post.relatedPosts.length > 0 && (
                            <ul>
                                {post.relatedPosts.map((related) => (
                                    <li key={related.id}>
                                        <Link to={`/post/${related.slug}`}>{related.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GlobalList;
