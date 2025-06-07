const express = require('express');
const cors = require('cors');
require('dotenv').config();

const checkJwt = require('./middleware/checkJwt');
const publicRoutes = require('./routes/public');
const protectedRoutes = require('./routes/protected');

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(cors());
app.use(express.json());

app.use('/public', publicRoutes);
app.use('/protected', checkJwt, protectedRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
