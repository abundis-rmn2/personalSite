import React, { forwardRef } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import NetworkGraph from './NetworkGraph';
import NetworkList from './NetworkList';

// Define post type mapping based on gatsby-node.js
const POST_TYPE_MAPPING = {
  'allWpRestPosts': 'blog',
  'allWpRestTalks': 'conference',
  'allWpRestCodeProjects': 'codeProject',
  'allWpRestArticles': 'paper',
  'allWpRestMultimedia': 'multimediaProject',
  'allWpRestMediaAppearances': 'mediaAppearance',
  'allWpRestThesis': 'thesis'
};

const GlobalList = forwardRef((props, ref) => (
  <StaticQuery
    query={graphql`
      query {
        allWpRestPosts {
          nodes {
            id
            databaseId
            title { rendered }
            path
            related_posts
          }
        }
        allWpRestTalks {
          nodes {
            id
            databaseId
            title { rendered }
            path
            related_posts
          }
        }
        allWpRestCodeProjects {
          nodes {
            id
            databaseId
            title { rendered }
            path
            related_posts
          }
        }
        allWpRestArticles {
          nodes {
            id
            databaseId
            title { rendered }
            path
            related_posts
          }
        }
        allWpRestMultimedia {
          nodes {
            id
            databaseId
            title { rendered }
            path
            related_posts
          }
        }
        allWpRestMediaAppearances {
          nodes {
            id
            databaseId
            title { rendered }
            path
            related_posts
          }
        }
        allWpRestThesis {
          nodes {
            id
            databaseId
            title { rendered }
            path
            related_posts
          }
        }
      }
    `}
    render={data => {
      // Create all posts array with type information
      const allPosts = Object.entries(data)
        .flatMap(([collectionName, collection]) => {
          const postType = POST_TYPE_MAPPING[collectionName] || 'unknown';
          
          return collection.nodes.map(post => {
            // Process related_posts to ensure it's always an array
            let relatedPosts = [];
            if (post.related_posts) {
              if (Array.isArray(post.related_posts)) {
                relatedPosts = post.related_posts;
              } else if (typeof post.related_posts === 'string') {
                try {
                  relatedPosts = JSON.parse(post.related_posts);
                  if (!Array.isArray(relatedPosts)) {
                    if (relatedPosts !== 0) {
                      relatedPosts = [relatedPosts]; // handle case where it's a single value
                    }
                  }
                } catch (e) {
                  // If not valid JSON, try splitting by comma
                  relatedPosts = post.related_posts.split(',').map(id => id.trim()).filter(id => id);
                }
              } else if (typeof post.related_posts === 'number') {
                // If it's a single ID
                relatedPosts = [post.related_posts];
              }
            }
            
            return {
              id: post.id,
              title: post.title.rendered,
              databaseId: post.databaseId,
              path: post.path,
              related_posts: relatedPosts,
              type: postType, // Add post type
              category: postType // Use type as category for graph grouping
            };
          });
        });
      
      // Create a lookup map of posts by ID
      const postsById = allPosts.reduce((acc, post) => {
        acc[post.databaseId] = post;
        return acc;
      }, {});
// <NetworkList posts={allPosts} postsById={postsById} />
      return (
        <>
         <NetworkGraph ref={ref} posts={allPosts} />
          
        </>
      );
    }}
  />
));

export default GlobalList;