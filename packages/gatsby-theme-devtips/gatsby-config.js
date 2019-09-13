module.exports = options => {
  return {
    siteMetadata: {
      siteUrl: "/"
    },
    plugins: [
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: "gatsby-theme-devtips",
          path: options.contentPath || "devtips"
        }
      },
      `gatsby-transformer-yaml`
    ]
  };
};
