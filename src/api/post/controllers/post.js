'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const axios = require("axios");
const fs = require("fs").promises;

// module.exports = createCoreController('api::post.post');

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
    import: async (ctx) => {
      const { data } = await axios.get(
        "https://wordpress.x-camp.academy/wp-json/wp/v2/posts?per_page=1&include=5885"
      );
      const posts = await Promise.all(
        data.map(
          (post) =>
            new Promise(async (resolve, reject) => {
              const {
                title: { rendered: titleRendered },
                content: { rendered: contentRendered },
                uagb_featured_image_src: { full : imageInfo },  
              } = post;
  
              try {
                const downloaded = await strapi
                  .service("api::post.download")
                  .download(imageInfo[0]);
  
                const [{ id: fileId }] = await strapi
                  .service("api::post.upload")
                  .upload(downloaded);
  
                const created = await strapi.entityService.create(
                  "api::post.post",
                  {
                    data: {
                      title: titleRendered,
                      content: contentRendered,
                    },
                  }
                );
                resolve(created);
              } catch (err) {
                reject(err);
              }
            })
        )
      );
  
      ctx.send(posts);
    },
  }));