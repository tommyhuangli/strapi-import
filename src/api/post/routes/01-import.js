module.exports = {
    routes: [
      {
        method: "GET",
        path: "/posts/import",
        handler: "post.import",
        config: {
          policies: [],
        },
      },
    ],
  };