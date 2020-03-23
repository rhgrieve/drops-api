"use strict";

require("dotenv").config();
const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const db = require("./lib/db");

const drop_controller = require("./controllers/dropController");

const routeOptions = {
  cors: true
};

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    const init = async () => {
      const server = Hapi.server({
        port: 3456,
        host: "localhost"
      });

      /* GET root */
      server.route({
        method: "GET",
        path: "/",
        handler: drop_controller.index
      });

      /* gets test endpoint */
      server.route({
        method: "GET",
        path: "/test",
        handler: drop_controller.test
      });

      /* gets all drops */
      server.route({
        method: "GET",
        path: "/drops",
        handler: drop_controller.drop_list,
        options: routeOptions
      });

      /* creates new drop */
      server.route({
        method: "POST",
        path: "/drop",
        handler: drop_controller.drop_create_post,
        options: routeOptions
      });

      /* gets drop by {id} */
      server.route({
        method: "GET",
        path: "/drop/{id}",
        handler: drop_controller.drop_detail
      });

      /* updates drop by {id} */
      server.route({
        method: "PUT",
        path: "/drop/{id}",
        handler: drop_controller.drop_update_post,
        options: routeOptions
      });

      /* deletes drop by {id} */
      server.route({
        method: "DELETE",
        path: "/drop/{id}",
        handler: drop_controller.drop_delete_post,
        options: routeOptions
      });

      /* delete all drops */
      server.route({
        method: "DELETE",
        path: "/drops",
        handler: drop_controller.drop_delete_all,
        options: {
          validate: {
            payload: Joi.object({
              really: Joi.boolean().required()
            })
          }
        }
      });

      await server.start();
      console.log("Server running on %s", server.info.uri);
    };

    process.on("unhandledRejection", err => {
      console.log(err);
      process.exit(1);
    });

    process.on("SIGTERM", () => {
      process.exit(1);
    });

    process.on("SIGINT", () => {
      console.info("\nprocess terminated by client");
      process.exit(1);
    });

    init();
  });
