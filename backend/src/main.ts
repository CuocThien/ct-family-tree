import { config } from 'dotenv';
config();

import { app } from './app';

const PORT = process.env.PORT || 4000;

console.log(`🚀 Server starting on port ${PORT}`);
console.log(`📊 Health check: http://localhost:${PORT}/health`);
console.log(`🔗 GraphQL: http://localhost:${PORT}/graphql`);

export default {
  port: PORT,
  fetch: app.fetch,
};
