import { config } from 'dotenv';
config();

import { app } from './app';
import { config as appConfig, validateProductionConfig } from './infrastructure/config';

// Validate production configuration
validateProductionConfig();

const PORT = appConfig.app.port;

console.log(`🚀 Server starting on port ${PORT}`);
console.log(`📊 Health check: http://localhost:${PORT}/health`);
console.log(`🔗 GraphQL: http://localhost:${PORT}/graphql`);

export default {
  port: PORT,
  fetch: app.fetch,
};
