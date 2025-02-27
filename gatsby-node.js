const path = require('path');

const POST_TYPES = {
  ARTICLE: {
    name: 'Article',
    wpRestType: 'articles',
    graphqlKey: 'allWpArticle',
    pathPrefix: 'paper',
    template: path.resolve('./src/templates/article.jsx')
  },
  THESIS: {
    name: 'Thesis',
    wpRestType: 'thesis',
    graphqlKey: 'allWpThesis',
    pathPrefix: 'thesis',
    template: path.resolve('./src/templates/thesis.jsx')
  },
  TALK: {
    name: 'Talk',
    wpRestType: 'talks',
    graphqlKey: 'allWpTalk',
    pathPrefix: 'conference',
    template: path.resolve('./src/templates/talk.jsx')
  },
  CODE_PROJECT: {
    name: 'Code Project',
    wpRestType: 'code-projects',
    graphqlKey: 'allWpCodeProject',
    pathPrefix: 'codeProject',
    template: path.resolve('./src/templates/codeProject.jsx')
  },
  MULTIMEDIA: {
    name: 'Multimedia Project',
    wpRestType: 'multimedia',
    graphqlKey: 'allWpMultimediaItem',
    pathPrefix: 'multimediaProject',
    template: path.resolve('./src/templates/multimedia.jsx')
  },
  MEDIA_APPEARANCE: {
    name: 'Media Appearance',
    wpRestType: 'media-appearances',
    graphqlKey: 'allWpMediaAppearance',
    pathPrefix: 'mediaAppearance',
    template: path.resolve('./src/templates/mediaAppearance.jsx')
  },
  POST: {
    name: 'Post',
    wpRestType: 'posts',
    graphqlKey: 'allWpPost',
    pathPrefix: 'blog',
  }
};

const customPostTypes = Object.values(POST_TYPES);

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Fetch data for all custom post types
  const result = await graphql(`
    {
      allWpArticle {
        nodes {
          id
          slug
        }
      }
      allWpTalk {
        nodes {
          id
          slug
        }
      }
      allWpCodeProject {
        nodes {
          id
          slug
        }
      }
      allWpMultimediaItem {
        nodes {
          id
          slug
        }
      }
      allWpMediaAppearance {
        nodes {
          id
          slug
        }
      }
      allWpThesis {
        nodes {
          id
          slug
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  // Loop through each custom post type and create pages
  customPostTypes.forEach((cpt) => {
    const posts = result.data[cpt.graphqlKey]?.nodes || [];

    if (!posts.length) {
      console.warn(`No posts found for custom post type: ${cpt.name}`);
      return;
    }

    posts.forEach((post) => {
      if (!post.slug) {
        console.warn(`Post with ID ${post.id} has no slug. Skipping...`);
        return;
      }

      createPage({
        path: `/${cpt.pathPrefix}/${post.slug}`,
        component: cpt.template,
        context: {
          id: post.id,
          slug: post.slug,
        },
      });
    });
  });
};

const axios = require('axios');

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  const WP_BASE_URL = 'https://headless.abundis.com.mx/wp-json/wp/v2';
  
  try {
    for (const type of Object.values(POST_TYPES)) {
      const response = await axios.get(`${WP_BASE_URL}/${type.wpRestType}`);
      response.data.forEach(post => {
        const nodeContent = {
          ...post,
          path: `/${type.pathPrefix}/${post.slug}`
        };

        createNode({
          ...nodeContent,
          id: createNodeId(`wp-rest-${type.wpRestType}-${post.id}`),
          databaseId: post.id,
          parent: null,
          children: [],
          internal: {
            type: `WpRest${type.wpRestType.charAt(0).toUpperCase() + type.wpRestType.slice(1).replace(/-./g, x => x[1].toUpperCase())}`,
            content: JSON.stringify(nodeContent),
            contentDigest: createContentDigest(nodeContent)
          }
        });
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};