const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Define an array of custom post types
  const customPostTypes = [
    {
      name: 'Article',
      graphqlKey: 'allWpArticle',
      pathPrefix: 'paper',
      template: path.resolve('./src/templates/article.jsx'),
    },
    {
      name: 'Thesis',
      graphqlKey: 'allWpThesis',
      pathPrefix: 'thesis',
      template: path.resolve('./src/templates/thesis.jsx'),
    },
    {
      name: 'Talk',
      graphqlKey: 'allWpTalk',
      pathPrefix: 'conference',
      template: path.resolve('./src/templates/talk.jsx'),
    },
    {
      name: 'Code Project',
      graphqlKey: 'allWpCodeProject',
      pathPrefix: 'codeProject',
      template: path.resolve('./src/templates/codeProject.jsx'),
    },
    {
      name: 'Multimedia Project',
      graphqlKey: 'allWpMultimediaItem',
      pathPrefix: 'multimediaProject',
      template: path.resolve('./src/templates/multimedia.jsx'),
    },
    {
      name: 'Media Appearance',
      graphqlKey: 'allWpMediaAppearance',
      pathPrefix: 'mediaAppearance',
      template: path.resolve('./src/templates/mediaAppearance.jsx'),
    },
  ];

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

/*
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type wpPost implements Node {
      relatedPosts: [wpPost] @link(from: "relatedPosts___NODE")
    }
    type wpCodeProject implements Node {
      relatedPosts: [wpPost] @link(from: "relatedPosts___NODE")
    }
    type wpTalk implements Node {
      relatedPosts: [wpPost] @link(from: "relatedPosts___NODE")
    }
    type wpArticle implements Node {
      relatedPosts: [wpPost] @link(from: "relatedPosts___NODE")
    }
    type wpMultimediaItem implements Node {
      relatedPosts: [wpPost] @link(from: "relatedPosts___NODE")
    }
    type wpMediaAppearance implements Node {
      relatedPosts: [wpPost] @link(from: "relatedPosts___NODE")
    }
    type wpThesis implements Node {
      relatedPosts: [wpPost] @link(from: "relatedPosts___NODE")
    }
  `);
};
*/