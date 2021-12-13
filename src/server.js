const config = require("./config");
const services = require("./services/services")({ config });
const routes = require("./routes");

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const startClientDB = require("./database").startDB;



fastify.register(require('fastify-swagger'), {
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Smart Contracts API',
      description: 'Smart Contracts API for Ubademy',
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost:8010',
    schemes: [
      'http',
      'https'
    ],
    consumes: ['application/json'],
    produces: ['application/json']
  }
});

// Declares routes
routes.forEach(route => fastify.route(route({ config, services })));

// Run the server!
const start = async () => {  try {
    await fastify.listen(8010);
    startClientDB();
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
