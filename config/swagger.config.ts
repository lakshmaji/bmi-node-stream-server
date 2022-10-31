import swaggerJsdoc from 'swagger-jsdoc';

// https://swagger.io/docs/specification/about/
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BMI API',
      version: '1.0.0',
      description: 'This is a REST API application made with Express and written in typescript.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Lakshmaji',
        url: 'https://github.com/lakshmaji',
      },
    },
    servers: [
      {
        url: 'http://localhost:3007',
        description: 'Local server',
      },
    ],
    tags: [
      {
        name: 'System',
        description: 'System API',
      },
      {
        name: 'BMI',
        description: 'BMI APIs for humans',
      },
      {
        name: 'Person',
        description: 'The Persons API',
      },
    ],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  apis: ['./features/**/routes/*.routes*.ts', './app.ts'],
};

export const openAPISpecification = swaggerJsdoc(swaggerOptions);
