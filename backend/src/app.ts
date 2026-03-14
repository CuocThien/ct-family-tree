import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { config } from './infrastructure/config';

const app = new Hono();

// Security headers
app.use('*', secureHeaders());

// CORS configuration
app.use(
  '*',
  cors({
    origin: config.cors.origins,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Request logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use('*', logger());
}

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// GraphQL endpoint will be added here

export { app };
