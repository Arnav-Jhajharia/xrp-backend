const swaggerAutogen = require('swagger-autogen');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
	title: 'XRP API',
	version: '1.0.0',
	description: 'TODO: Add a description of the API here',
  },
};
const outputFile = './docs/swagger-output.json';
const endpointsFiles = ['./routes/public.js', './routes/protected.js'];

const options = {
  swaggerDefinition,
  apis: endpointsFiles, 
};

swaggerAutogen()(outputFile, endpointsFiles).then(() => {
  console.log('Swagger documentation generated!');
});
