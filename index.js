const express = require('express');
const cors = require('cors');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const checkJwt = require('./middleware/checkJwt');
const publicRoutes = require('./routes/public');
const protectedRoutes = require('./routes/protected');

const swaggerDocument = JSON.parse(fs.readFileSync('./docs/swagger-output.json', 'utf-8'));



const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());

app.use('/public', publicRoutes);
app.use('/protected', checkJwt, protectedRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
