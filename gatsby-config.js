module.exports = {
  siteMetadata: {
    title: `Your Site Title`,
    description: `Your site description.`,
    author: `Your Name`, // Add this field
  },
  flags: {
    DEV_SSR: false,
  },
  plugins: [
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        url:
          `https://headless.abundis.com.mx/graphql`, // Replace with your WordPress GraphQL endpoint
        schema: {
          timeout: 60000, // Increase timeout if your schema is large
          perPage: 20, // Number of items to fetch per request
          requestConcurrency: 1, // Number of concurrent requests
        },
        verbose: true, // Add verbose logging for debugging
        type: {
          Post: {
            limit: process.env.NODE_ENV === `development` ? 50 : 5000, // Limit posts in development for faster builds
          },
        },
        develop: {
          hardCacheMediaFiles: true, // Cache media files during development
        },
        production: {
          hardCacheMediaFiles: true, // Cache media files during production
        },
      },
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-anchor-links`,
      options: {
        offset: -50, // Adjust based on your header size
        duration: 1000, // Smooth scroll duration
      },
    },
  ],
};