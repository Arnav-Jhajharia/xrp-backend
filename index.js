/**
 * index.js
 * Express + Swagger + Auth0-protected REST  + Apollo GraphQL on MongoDB
 * --------------------------------------------------------------------
 *  • /api-docs      – Swagger UI (public)
 *  • /public/*      – Public REST routes
 *  • /protected/*   – Auth0-JWT-protected REST routes
 *  • /graphql       – Auth0-JWT-protected GraphQL API
 */

require('dotenv').config();

const fs          = require('fs');
const express     = require('express');
const cors        = require('cors');
const swaggerUi   = require('swagger-ui-express');

const { ApolloServer } = require('apollo-server-express');

const { checkJwt, getUser } = require('./middleware/checkJwt');
const publicRoutes    = require('./routes/public');
const plaidRoutes = require('./routes/plaid');
const argyleRoutes = require('./routes/argyle');
const protectedRoutes = require('./routes/protected');
const { typeDefs }    = require('./graphql/schema');
const { resolvers }   = require('./graphql/resolvers');

const swaggerDocument = JSON.parse(
  fs.readFileSync('./docs/swagger-output.json', 'utf-8')
);

async function start() {
  const app = express();

  /* ---------- shared middleware ---------- */
  app.use(cors());
  app.use(express.json());

  /* ---------- Swagger (public) ----------- */
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  /* ---------- REST routes ---------------- */
  app.use('/public',    publicRoutes);
  app.use('/protected', checkJwt, protectedRoutes);
  app.use('/plaid', plaidRoutes); // Plaid routes
  app.use('/argyle', argyleRoutes); // Argyle routes
  /* ---------- GraphQL layer -------------- */
  const gqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Re-apply Auth0 to GraphQL requests
      await new Promise((res, rej) =>
        checkJwt(req, {}, (err) => (err ? rej(err) : res()))
      );
      return { user: getUser(req) };   // Pass decoded JWT to resolvers
    },
  });

  await gqlServer.start();
  gqlServer.applyMiddleware({ app, path: '/graphql' });

  /* ---------- Boot ----------------------- */
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`🚀  REST server:    http://localhost:${port}`);
    console.log(`📚  Swagger docs:   http://localhost:${port}/api-docs`);
    console.log(`🧬  GraphQL:        http://localhost:${port}${gqlServer.graphqlPath}`);
  });
}

start();
