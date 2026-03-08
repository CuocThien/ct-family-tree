# Family Tree V2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a multi-family SaaS platform for genealogy management with React frontend and Bun.js backend.

**Architecture:** Hybrid Clean Architecture with four layers (Presentation, Application, Domain, Infrastructure). Frontend uses React + Jotai + Apollo Client. Backend uses Bun.js + Hono + Pothos (GraphQL) + MongoDB + MinIO.

**Tech Stack:**
- Frontend: React 18, Vite, TypeScript, Jotai, Apollo Client, Ant Design, Tailwind CSS
- Backend: Bun.js, Hono, Pothos, MongoDB, Mongoose, MinIO, Zod
- Testing: Vitest, Bun test, Playwright

---

## Phase 1: Foundation (Week 1)

### Task 1.1: Initialize Backend Project

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/src/main.ts`
- Create: `backend/src/app.ts`

**Step 1: Create backend directory and package.json**

```bash
mkdir -p backend/src
```

```json
// backend/package.json
{
  "name": "familytree-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "bun run --watch src/main.ts",
    "build": "bun build src/main.ts --outdir dist",
    "start": "bun run dist/main.js",
    "test": "bun test",
    "test:coverage": "bun test --coverage",
    "lint": "eslint src tests"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "@hono/graphql": "^0.4.0",
    "mongoose": "^8.0.0",
    "@pothos/core": "^3.0.0",
    "@pothos/plugin-zod": "^3.0.0",
    "zod": "^3.22.0",
    "jose": "^5.0.0",
    "minio": "^7.1.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.0.0"
  }
}
```

**Step 2: Create tsconfig.json**

```json
// backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**Step 3: Create main entry point**

```typescript
// backend/src/main.ts
import { app } from './app';

const PORT = process.env.PORT || 4000;

console.log(`🚀 Server starting on port ${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
```

**Step 4: Create Hono app**

```typescript
// backend/src/app.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GraphQL endpoint will be added later

export { app };
```

**Step 5: Install dependencies and verify**

```bash
cd backend
bun install
bun run dev
```

Expected: Server starts on port 4000

**Step 6: Test health endpoint**

```bash
curl http://localhost:4000/health
```

Expected: `{"status":"ok","timestamp":"..."}`

**Step 7: Commit**

```bash
git add backend/
git commit -m "feat(backend): initialize Bun.js project with Hono framework"
```

---

### Task 1.2: Initialize Frontend Project

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/styles/global.css`

**Step 1: Create frontend directory structure**

```bash
mkdir -p frontend/src/{app,features,shared,graphql,i18n,styles}
mkdir -p frontend/public/locales/{en,vi}
```

**Step 2: Create package.json**

```json
// frontend/package.json
{
  "name": "familytree-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "lint": "eslint src --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@apollo/client": "^3.8.0",
    "graphql": "^16.8.0",
    "jotai": "^2.5.0",
    "antd": "^5.12.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "react-i18next": "^13.5.0",
    "i18next": "^23.7.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0"
  }
}
```

**Step 3: Create vite.config.ts**

```typescript
// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
```

**Step 4: Create tsconfig.json**

```json
// frontend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 5: Create tailwind.config.js**

```javascript
// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [],
  // Avoid conflicts with Ant Design
  corePlugins: {
    preflight: false,
  },
};
```

**Step 6: Create global styles**

```css
/* frontend/src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Ant Design overrides */
.ant-layout {
  min-height: 100vh;
}

.ant-layout-sider {
  background: #001529;
}

/* Custom utilities */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
```

**Step 7: Create index.html**

```html
<!-- frontend/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Family Tree</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 8: Create main.tsx**

```typescript
// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0ea5e9',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
```

**Step 9: Create App.tsx**

```typescript
// frontend/src/App.tsx
import { Button } from 'antd';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Family Tree V2
        </h1>
        <p className="text-gray-600 mb-6">
          Multi-family genealogy management platform
        </p>
        <Button type="primary" size="large">
          Get Started
        </Button>
      </div>
    </div>
  );
}

export default App;
```

**Step 10: Install dependencies and verify**

```bash
cd frontend
npm install
npm run dev
```

Expected: App runs on http://localhost:3000

**Step 11: Commit**

```bash
git add frontend/
git commit -m "feat(frontend): initialize React project with Vite, Ant Design, and Tailwind"
```

---

### Task 1.3: Setup Docker Infrastructure

**Files:**
- Create: `docker-compose.yml`
- Create: `docker-compose.dev.yml`
- Create: `.env.example` (update)
- Create: `scripts/mongo-init.js`

**Step 1: Create docker-compose.yml**

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
    volumes:
      - mongodb-data:/data/db
      - ./scripts/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - familytree-network

  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=${MINIO_ACCESS_KEY}
      - MINIO_ROOT_PASSWORD=${MINIO_SECRET_KEY}
    command: server /data --console-address ":9001"
    volumes:
      - minio-data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - familytree-network

volumes:
  mongodb-data:
  minio-data:

networks:
  familytree-network:
    driver: bridge
```

**Step 2: Create docker-compose.dev.yml**

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  mongodb:
    ports:
      - "27017:27017"

  minio:
    ports:
      - "9000:9000"
      - "9001:9001"
```

**Step 3: Create mongo-init.js**

```javascript
// scripts/mongo-init.js
db = db.getSiblingDB('familytree');

db.createCollection('users');
db.createCollection('families');
db.createCollection('members');
db.createCollection('relationships');
db.createCollection('media');
db.createCollection('sources');
db.createCollection('timelines');

// Create indexes
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ familyId: 1 });

db.families.createIndex({ ownerId: 1 });
db.families.createIndex({ 'shareLinks.token': 1 });

db.members.createIndex({ familyId: 1 });
db.members.createIndex({ familyId: 1, 'personalInfo.firstName': 1, 'personalInfo.lastName': 1 });
db.members.createIndex(
  { 'personalInfo.firstName': 'text', 'personalInfo.lastName': 'text', bio: 'text', occupation: 'text' },
  { weights: { 'personalInfo.firstName': 10, 'personalInfo.lastName': 10, bio: 5, occupation: 3 } }
);

db.relationships.createIndex({ familyId: 1 });
db.relationships.createIndex({ person1Id: 1, person2Id: 1, type: 1 }, { unique: true });

db.media.createIndex({ familyId: 1 });
db.media.createIndex({ uploadedBy: 1 });

db.sources.createIndex({ familyId: 1 });

db.timelines.createIndex({ familyId: 1 });
db.timelines.createIndex({ memberIds: 1 });

print('Database initialized successfully');
```

**Step 4: Update .env.example**

```bash
# .env.example
# App
NODE_ENV=development
PORT=4000

# MongoDB
MONGODB_URI=mongodb://admin:password@localhost:27017/familytree?authSource=admin
MONGO_ROOT_PASSWORD=your_mongo_password

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin_secret
MINIO_BUCKET=familytree-media
MINIO_USE_SSL=false

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Security
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# Backup
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30

# Frontend
VITE_API_URL=http://localhost:4000/graphql
```

**Step 5: Copy .env.example to .env**

```bash
cp .env.example .env
```

**Step 6: Start Docker services**

```bash
docker-compose up -d
```

**Step 7: Verify services are running**

```bash
docker-compose ps
```

Expected: mongodb and minio services are "healthy"

**Step 8: Commit**

```bash
git add docker-compose.yml docker-compose.dev.yml scripts/ .env.example
git commit -m "feat(infra): add Docker Compose configuration for MongoDB and MinIO"
```

---

### Task 1.4: Setup MongoDB Connection

**Files:**
- Create: `backend/src/infrastructure/config/index.ts`
- Create: `backend/src/infrastructure/database/connection.ts`
- Test: `backend/tests/unit/infrastructure/database.test.ts`

**Step 1: Write failing test**

```typescript
// backend/tests/unit/infrastructure/database.test.ts
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { connectToDatabase, disconnectFromDatabase } from '@/infrastructure/database/connection';

describe('Database Connection', () => {
  test('should connect to MongoDB', async () => {
    await connectToDatabase();
    // If we get here without throwing, connection succeeded
    expect(true).toBe(true);
  });

  test('should disconnect from MongoDB', async () => {
    await disconnectFromDatabase();
    expect(true).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd backend
bun test tests/unit/infrastructure/database.test.ts
```

Expected: FAIL - Cannot find module '@/infrastructure/database/connection'

**Step 3: Create config**

```typescript
// backend/src/infrastructure/config/index.ts
import 'dotenv/config';

export const config = {
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/familytree',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    bucket: process.env.MINIO_BUCKET || 'familytree-media',
    useSSL: process.env.MINIO_USE_SSL === 'true',
  },
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  },
};
```

**Step 4: Create database connection**

```typescript
// backend/src/infrastructure/database/connection.ts
import mongoose from 'mongoose';
import { config } from '@/infrastructure/config';

let isConnected = false;

export async function connectToDatabase(): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(config.database.uri);
    isConnected = true;
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  if (!isConnected) {
    return;
  }

  await mongoose.disconnect();
  isConnected = false;
  console.log('📦 Disconnected from MongoDB');
}

export function getDatabaseConnectionStatus(): boolean {
  return isConnected;
}
```

**Step 5: Run test to verify it passes**

```bash
cd backend
bun test tests/unit/infrastructure/database.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add backend/src/infrastructure/config/ backend/src/infrastructure/database/ backend/tests/
git commit -m "feat(backend): add MongoDB connection with configuration"
```

---

### Task 1.5: Create Domain Layer - Errors

**Files:**
- Create: `backend/src/domain/errors/DomainError.ts`
- Create: `backend/src/domain/errors/NotFoundError.ts`
- Create: `backend/src/domain/errors/UnauthorizedError.ts`
- Create: `backend/src/domain/errors/ValidationError.ts`
- Create: `backend/src/domain/errors/ConflictError.ts`
- Create: `backend/src/domain/errors/index.ts`
- Test: `backend/tests/unit/domain/errors/DomainError.test.ts`

**Step 1: Write failing test**

```typescript
// backend/tests/unit/domain/errors/DomainError.test.ts
import { describe, test, expect } from 'bun:test';
import { DomainError } from '@/domain/errors/DomainError';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';
import { ValidationError } from '@/domain/errors/ValidationError';
import { ConflictError } from '@/domain/errors/ConflictError';

describe('Domain Errors', () => {
  test('DomainError should have correct name and message', () => {
    const error = new DomainError('Test error');
    expect(error.name).toBe('DomainError');
    expect(error.message).toBe('Test error');
  });

  test('NotFoundError should have correct properties', () => {
    const error = new NotFoundError('Member', '123');
    expect(error.name).toBe('NotFoundError');
    expect(error.message).toBe('Member with id 123 not found');
  });

  test('UnauthorizedError should have correct properties', () => {
    const error = new UnauthorizedError('Access denied');
    expect(error.name).toBe('UnauthorizedError');
    expect(error.message).toBe('Access denied');
  });

  test('ValidationError should have correct properties', () => {
    const error = new ValidationError('Invalid email');
    expect(error.name).toBe('ValidationError');
    expect(error.message).toBe('Invalid email');
  });

  test('ConflictError should have correct properties', () => {
    const error = new ConflictError('Duplicate username');
    expect(error.name).toBe('ConflictError');
    expect(error.message).toBe('Duplicate username');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd backend
bun test tests/unit/domain/errors/
```

Expected: FAIL - Cannot find modules

**Step 3: Create domain errors**

```typescript
// backend/src/domain/errors/DomainError.ts
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

// backend/src/domain/errors/NotFoundError.ts
import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(entity: string, identifier: string) {
    super(`${entity} with id ${identifier} not found`);
    this.name = 'NotFoundError';
  }
}

// backend/src/domain/errors/UnauthorizedError.ts
import { DomainError } from './DomainError';

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// backend/src/domain/errors/ValidationError.ts
import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// backend/src/domain/errors/ConflictError.ts
import { DomainError } from './DomainError';

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

// backend/src/domain/errors/index.ts
export { DomainError } from './DomainError';
export { NotFoundError } from './NotFoundError';
export { UnauthorizedError } from './UnauthorizedError';
export { ValidationError } from './ValidationError';
export { ConflictError } from './ConflictError';
```

**Step 4: Run test to verify it passes**

```bash
cd backend
bun test tests/unit/domain/errors/
```

Expected: PASS

**Step 5: Commit**

```bash
git add backend/src/domain/errors/ backend/tests/unit/domain/
git commit -m "feat(backend): add domain error classes"
```

---

### Task 1.6: Create Domain Layer - Value Objects

**Files:**
- Create: `backend/src/domain/value-objects/PartialDate.ts`
- Create: `backend/src/domain/value-objects/Address.ts`
- Create: `backend/src/domain/value-objects/LifeEvent.ts`
- Create: `backend/src/domain/value-objects/index.ts`
- Test: `backend/tests/unit/domain/value-objects/PartialDate.test.ts`

**Step 1: Write failing test**

```typescript
// backend/tests/unit/domain/value-objects/PartialDate.test.ts
import { describe, test, expect } from 'bun:test';
import { PartialDate } from '@/domain/value-objects/PartialDate';

describe('PartialDate', () => {
  test('should create with year only', () => {
    const date = PartialDate.create({ year: 1990 });
    expect(date.year).toBe(1990);
    expect(date.month).toBeUndefined();
    expect(date.day).toBeUndefined();
  });

  test('should create with full date', () => {
    const date = PartialDate.create({ year: 1990, month: 5, day: 15 });
    expect(date.year).toBe(1990);
    expect(date.month).toBe(5);
    expect(date.day).toBe(15);
  });

  test('should throw ValidationError for invalid year', () => {
    expect(() => PartialDate.create({ year: 0 })).toThrow(ValidationError);
    expect(() => PartialDate.create({ year: 3000 })).toThrow(ValidationError);
  });

  test('should throw ValidationError for invalid month', () => {
    expect(() => PartialDate.create({ year: 1990, month: 0 })).toThrow(ValidationError);
    expect(() => PartialDate.create({ year: 1990, month: 13 })).toThrow(ValidationError);
  });

  test('should throw ValidationError for invalid day', () => {
    expect(() => PartialDate.create({ year: 1990, month: 5, day: 0 })).toThrow(ValidationError);
    expect(() => PartialDate.create({ year: 1990, month: 5, day: 32 })).toThrow(ValidationError);
  });

  test('should convert to Date object', () => {
    const date = PartialDate.create({ year: 1990, month: 5, day: 15 });
    const jsDate = date.toDate();
    expect(jsDate.getFullYear()).toBe(1990);
    expect(jsDate.getMonth()).toBe(4); // 0-indexed
    expect(jsDate.getDate()).toBe(15);
  });

  test('should format as string', () => {
    expect(PartialDate.create({ year: 1990 }).format()).toBe('1990');
    expect(PartialDate.create({ year: 1990, month: 5 }).format()).toBe('1990-05');
    expect(PartialDate.create({ year: 1990, month: 5, day: 15 }).format()).toBe('1990-05-15');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd backend
bun test tests/unit/domain/value-objects/PartialDate.test.ts
```

Expected: FAIL

**Step 3: Create PartialDate value object**

```typescript
// backend/src/domain/value-objects/PartialDate.ts
import { ValidationError } from '@/domain/errors';

interface PartialDateProps {
  year: number;
  month?: number;
  day?: number;
  isApproximate?: boolean;
}

export class PartialDate {
  readonly year: number;
  readonly month?: number;
  readonly day?: number;
  readonly isApproximate: boolean;

  private constructor(props: PartialDateProps) {
    this.year = props.year;
    this.month = props.month;
    this.day = props.day;
    this.isApproximate = props.isApproximate ?? false;
  }

  static create(props: PartialDateProps): PartialDate {
    // Validate year
    if (props.year < 1 || props.year > 2100) {
      throw new ValidationError('Year must be between 1 and 2100');
    }

    // Validate month if provided
    if (props.month !== undefined) {
      if (props.month < 1 || props.month > 12) {
        throw new ValidationError('Month must be between 1 and 12');
      }
    }

    // Validate day if provided
    if (props.day !== undefined) {
      if (props.day < 1 || props.day > 31) {
        throw new ValidationError('Day must be between 1 and 31');
      }
    }

    return new PartialDate(props);
  }

  toDate(): Date {
    return new Date(
      this.year,
      (this.month ?? 1) - 1,
      this.day ?? 1
    );
  }

  format(): string {
    const year = this.year.toString();
    const month = this.month?.toString().padStart(2, '0') ?? '';
    const day = this.day?.toString().padStart(2, '0') ?? '';

    if (this.month && this.day) {
      return `${year}-${month}-${day}`;
    }
    if (this.month) {
      return `${year}-${month}`;
    }
    return year;
  }

  toJSON() {
    return {
      year: this.year,
      month: this.month,
      day: this.day,
      isApproximate: this.isApproximate,
    };
  }
}
```

**Step 4: Run test to verify it passes**

```bash
cd backend
bun test tests/unit/domain/value-objects/PartialDate.test.ts
```

Expected: PASS

**Step 5: Create Address value object**

```typescript
// backend/src/domain/value-objects/Address.ts
interface AddressProps {
  street?: string;
  city?: string;
  state?: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export class Address {
  readonly street?: string;
  readonly city?: string;
  readonly state?: string;
  readonly country: string;
  readonly coordinates?: { lat: number; lng: number };

  private constructor(props: AddressProps) {
    this.street = props.street;
    this.city = props.city;
    this.state = props.state;
    this.country = props.country;
    this.coordinates = props.coordinates;
  }

  static create(props: AddressProps): Address {
    if (!props.country) {
      throw new Error('Country is required');
    }
    return new Address(props);
  }

  format(): string {
    const parts = [this.street, this.city, this.state, this.country].filter(Boolean);
    return parts.join(', ');
  }

  toJSON() {
    return {
      street: this.street,
      city: this.city,
      state: this.state,
      country: this.country,
      coordinates: this.coordinates,
    };
  }
}
```

**Step 6: Create LifeEvent value object**

```typescript
// backend/src/domain/value-objects/LifeEvent.ts
import { PartialDate } from './PartialDate';
import { Address } from './Address';
import { ValidationError } from '@/domain/errors';

export type LifeEventType = 'BIRTH' | 'DEATH' | 'MARRIAGE' | 'WORK' | 'CUSTOM';

interface LifeEventProps {
  type: LifeEventType;
  customType?: string;
  date?: PartialDate;
  location?: Address;
  notes?: string;
  mediaIds?: string[];
}

export class LifeEvent {
  readonly type: LifeEventType;
  readonly customType?: string;
  readonly date?: PartialDate;
  readonly location?: Address;
  readonly notes?: string;
  readonly mediaIds: string[];

  private constructor(props: LifeEventProps) {
    this.type = props.type;
    this.customType = props.customType;
    this.date = props.date;
    this.location = props.location;
    this.notes = props.notes;
    this.mediaIds = props.mediaIds ?? [];
  }

  static create(props: LifeEventProps): LifeEvent {
    if (props.type === 'CUSTOM' && !props.customType) {
      throw new ValidationError('customType is required when type is CUSTOM');
    }

    return new LifeEvent(props);
  }

  toJSON() {
    return {
      type: this.type,
      customType: this.customType,
      date: this.date?.toJSON(),
      location: this.location?.toJSON(),
      notes: this.notes,
      mediaIds: this.mediaIds,
    };
  }
}
```

**Step 7: Create index**

```typescript
// backend/src/domain/value-objects/index.ts
export { PartialDate } from './PartialDate';
export { Address } from './Address';
export { LifeEvent } from './LifeEvent';
export type { LifeEventType } from './LifeEvent';
```

**Step 8: Commit**

```bash
git add backend/src/domain/value-objects/ backend/tests/unit/domain/value-objects/
git commit -m "feat(backend): add domain value objects (PartialDate, Address, LifeEvent)"
```

---

### Task 1.7: Create Domain Layer - User Entity

**Files:**
- Create: `backend/src/domain/entities/User.ts`
- Create: `backend/src/domain/entities/index.ts`
- Test: `backend/tests/unit/domain/entities/User.test.ts`

**Step 1: Write failing test**

```typescript
// backend/tests/unit/domain/entities/User.test.ts
import { describe, test, expect } from 'bun:test';
import { User } from '@/domain/entities/User';

describe('User Entity', () => {
  test('should create user with required fields', () => {
    const user = User.create({
      username: 'testuser',
      passwordHash: 'hashedpassword',
      role: 'OWNER',
      familyId: 'family-123',
    });

    expect(user.username).toBe('testuser');
    expect(user.role).toBe('OWNER');
    expect(user.familyId).toBe('family-123');
  });

  test('should throw ValidationError for invalid username', () => {
    expect(() => User.create({
      username: 'ab',
      passwordHash: 'hash',
      role: 'OWNER',
      familyId: 'family-123',
    })).toThrow(ValidationError);
  });

  test('should throw ValidationError for invalid role', () => {
    expect(() => User.create({
      username: 'testuser',
      passwordHash: 'hash',
      role: 'ADMIN' as any,
      familyId: 'family-123',
    })).toThrow(ValidationError);
  });

  test('should check if user is owner', () => {
    const owner = User.create({
      username: 'owner',
      passwordHash: 'hash',
      role: 'OWNER',
      familyId: 'family-123',
    });
    expect(owner.isOwner()).toBe(true);

    const editor = User.create({
      username: 'editor',
      passwordHash: 'hash',
      role: 'EDITOR',
      familyId: 'family-123',
    });
    expect(editor.isOwner()).toBe(false);
  });

  test('should check if user can edit', () => {
    const owner = User.create({
      username: 'owner',
      passwordHash: 'hash',
      role: 'OWNER',
      familyId: 'family-123',
    });
    expect(owner.canEdit()).toBe(true);

    const editor = User.create({
      username: 'editor',
      passwordHash: 'hash',
      role: 'EDITOR',
      familyId: 'family-123',
    });
    expect(editor.canEdit()).toBe(true);

    const viewer = User.create({
      username: 'viewer',
      passwordHash: 'hash',
      role: 'VIEWER',
      familyId: 'family-123',
    });
    expect(viewer.canEdit()).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd backend
bun test tests/unit/domain/entities/User.test.ts
```

Expected: FAIL

**Step 3: Create User entity**

```typescript
// backend/src/domain/entities/User.ts
import { ValidationError } from '@/domain/errors';

export type UserRole = 'OWNER' | 'EDITOR' | 'VIEWER';

interface UserProps {
  id?: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  familyId: string;
  memberProfileId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  readonly id?: string;
  readonly username: string;
  readonly passwordHash: string;
  readonly role: UserRole;
  readonly familyId: string;
  readonly memberProfileId?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.familyId = props.familyId;
    this.memberProfileId = props.memberProfileId;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: UserProps): User {
    // Validate username
    if (!props.username || props.username.length < 3 || props.username.length > 30) {
      throw new ValidationError('Username must be between 3 and 30 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(props.username)) {
      throw new ValidationError('Username can only contain letters, numbers, and underscores');
    }

    // Validate role
    const validRoles: UserRole[] = ['OWNER', 'EDITOR', 'VIEWER'];
    if (!validRoles.includes(props.role)) {
      throw new ValidationError('Invalid role');
    }

    return new User(props);
  }

  isOwner(): boolean {
    return this.role === 'OWNER';
  }

  canEdit(): boolean {
    return this.role === 'OWNER' || this.role === 'EDITOR';
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      familyId: this.familyId,
      memberProfileId: this.memberProfileId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
```

**Step 4: Create entities index**

```typescript
// backend/src/domain/entities/index.ts
export { User } from './User';
export type { UserRole } from './User';
```

**Step 5: Run test to verify it passes**

```bash
cd backend
bun test tests/unit/domain/entities/User.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add backend/src/domain/entities/ backend/tests/unit/domain/entities/
git commit -m "feat(backend): add User domain entity with role validation"
```

---

### Task 1.8: Create Mongoose Models

**Files:**
- Create: `backend/src/infrastructure/database/models/User.ts`
- Create: `backend/src/infrastructure/database/models/Family.ts`
- Create: `backend/src/infrastructure/database/models/index.ts`

**Step 1: Create User model**

```typescript
// backend/src/infrastructure/database/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  passwordHash: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  familyId: mongoose.Types.ObjectId;
  memberProfileId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['OWNER', 'EDITOR', 'VIEWER'],
      required: true,
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
      required: true,
    },
    memberProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
```

**Step 2: Create Family model**

```typescript
// backend/src/infrastructure/database/models/Family.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ShareLink {
  token: string;
  passwordHash?: string;
  expiresAt?: Date;
  createdAt: Date;
}

export interface FamilyDocument extends Document {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  description?: string;
  settings: {
    isPublic: boolean;
  };
  shareLinks: ShareLink[];
  createdAt: Date;
  updatedAt: Date;
}

const ShareLinkSchema = new Schema(
  {
    token: { type: String, required: true },
    passwordHash: { type: String },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const FamilySchema = new Schema<FamilyDocument>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    settings: {
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
    shareLinks: [ShareLinkSchema],
  },
  {
    timestamps: true,
  }
);

export const FamilyModel = mongoose.model<FamilyDocument>('Family', FamilySchema);
```

**Step 3: Create models index**

```typescript
// backend/src/infrastructure/database/models/index.ts
export { UserModel, UserDocument } from './User';
export { FamilyModel, FamilyDocument } from './Family';
```

**Step 4: Commit**

```bash
git add backend/src/infrastructure/database/models/
git commit -m "feat(backend): add Mongoose models for User and Family"
```

---

### Task 1.9: Create Repository Interfaces

**Files:**
- Create: `backend/src/domain/interfaces/IUserRepository.ts`
- Create: `backend/src/domain/interfaces/IFamilyRepository.ts`
- Create: `backend/src/domain/interfaces/index.ts`

**Step 1: Create IUserRepository interface**

```typescript
// backend/src/domain/interfaces/IUserRepository.ts
import { User, UserRole } from '@/domain/entities';

export interface CreateUserInput {
  username: string;
  passwordHash: string;
  role: UserRole;
  familyId: string;
  memberProfileId?: string;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByFamilyId(familyId: string): Promise<User[]>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
```

**Step 2: Create IFamilyRepository interface**

```typescript
// backend/src/domain/interfaces/IFamilyRepository.ts
import { Family } from '@/domain/entities';

export interface CreateFamilyInput {
  name: string;
  ownerId: string;
  description?: string;
}

export interface IFamilyRepository {
  findById(id: string): Promise<Family | null>;
  findByOwnerId(ownerId: string): Promise<Family | null>;
  create(input: CreateFamilyInput): Promise<Family>;
  update(id: string, updates: Partial<Family>): Promise<Family>;
  delete(id: string): Promise<void>;
}
```

**Step 3: Create interfaces index**

```typescript
// backend/src/domain/interfaces/index.ts
export { IUserRepository, CreateUserInput } from './IUserRepository';
export { IFamilyRepository, CreateFamilyInput } from './IFamilyRepository';
```

**Step 4: Commit**

```bash
git add backend/src/domain/interfaces/
git commit -m "feat(backend): add repository interfaces for User and Family"
```

---

### Task 1.10: Implement UserRepository

**Files:**
- Create: `backend/src/infrastructure/database/repositories/UserRepository.ts`
- Create: `backend/src/infrastructure/database/repositories/index.ts`
- Test: `backend/tests/integration/repositories/UserRepository.test.ts`

**Step 1: Write failing test**

```typescript
// backend/tests/integration/repositories/UserRepository.test.ts
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { UserRepository } from '@/infrastructure/database/repositories/UserRepository';
import { connectToDatabase, disconnectFromDatabase } from '@/infrastructure/database/connection';
import { UserModel } from '@/infrastructure/database/models';

describe('UserRepository', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await disconnectFromDatabase();
  });

  test('should create a user', async () => {
    const repo = new UserRepository();
    const user = await repo.create({
      username: 'testuser',
      passwordHash: 'hashedpassword',
      role: 'OWNER',
      familyId: '507f1f77bcf86cd799439011',
    });

    expect(user.id).toBeDefined();
    expect(user.username).toBe('testuser');
  });

  test('should find user by username', async () => {
    const repo = new UserRepository();
    const user = await repo.findByUsername('testuser');

    expect(user).not.toBeNull();
    expect(user?.username).toBe('testuser');
  });

  test('should return null for non-existent username', async () => {
    const repo = new UserRepository();
    const user = await repo.findByUsername('nonexistent');

    expect(user).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd backend
bun test tests/integration/repositories/UserRepository.test.ts
```

Expected: FAIL

**Step 3: Implement UserRepository**

```typescript
// backend/src/infrastructure/database/repositories/UserRepository.ts
import { User, UserRole } from '@/domain/entities';
import { IUserRepository, CreateUserInput } from '@/domain/interfaces';
import { UserModel } from '../models';
import { NotFoundError } from '@/domain/errors';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByUsername(username: string): Promise<User | null> {
    const doc = await UserModel.findOne({ username });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByFamilyId(familyId: string): Promise<User[]> {
    const docs = await UserModel.find({ familyId });
    return docs.map((doc) => this.toEntity(doc));
  }

  async create(input: CreateUserInput): Promise<User> {
    const doc = await UserModel.create({
      ...input,
      familyId: input.familyId,
    });
    return this.toEntity(doc);
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    if (!doc) {
      throw new NotFoundError('User', id);
    }
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  private toEntity(doc: any): User {
    return User.create({
      id: doc._id.toString(),
      username: doc.username,
      passwordHash: doc.passwordHash,
      role: doc.role as UserRole,
      familyId: doc.familyId.toString(),
      memberProfileId: doc.memberProfileId?.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
```

**Step 4: Create repositories index**

```typescript
// backend/src/infrastructure/database/repositories/index.ts
export { UserRepository } from './UserRepository';
```

**Step 5: Run test to verify it passes**

```bash
cd backend
bun test tests/integration/repositories/UserRepository.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add backend/src/infrastructure/database/repositories/ backend/tests/integration/
git commit -m "feat(backend): implement UserRepository with Mongoose"
```

---

### Task 1.11: Implement Password Hashing

**Files:**
- Create: `backend/src/utils/hash.ts`
- Test: `backend/tests/unit/utils/hash.test.ts`

**Step 1: Write failing test**

```typescript
// backend/tests/unit/utils/hash.test.ts
import { describe, test, expect } from 'bun:test';
import { hashPassword, verifyPassword } from '@/utils/hash';

describe('Password Hashing', () => {
  test('should hash password', async () => {
    const password = 'TestPassword123';
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  test('should verify correct password', async () => {
    const password = 'TestPassword123';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);

    expect(isValid).toBe(true);
  });

  test('should reject incorrect password', async () => {
    const password = 'TestPassword123';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword('WrongPassword', hash);

    expect(isValid).toBe(false);
  });

  test('should generate different hashes for same password', async () => {
    const password = 'TestPassword123';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd backend
bun test tests/unit/utils/hash.test.ts
```

Expected: FAIL

**Step 3: Implement password hashing**

```typescript
// backend/src/utils/hash.ts
import { hash, verify } from 'bun';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    algorithm: 'bcrypt',
    cost: SALT_ROUNDS,
  });
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await verify(password, hashedPassword, 'bcrypt');
}
```

**Step 4: Run test to verify it passes**

```bash
cd backend
bun test tests/unit/utils/hash.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add backend/src/utils/ backend/tests/unit/utils/
git commit -m "feat(backend): add password hashing utilities using bcrypt"
```

---

### Task 1.12: Implement JWT Token Utilities

**Files:**
- Create: `backend/src/utils/token.ts`
- Test: `backend/tests/unit/utils/token.test.ts`

**Step 1: Write failing test**

```typescript
// backend/tests/unit/utils/token.test.ts
import { describe, test, expect } from 'bun:test';
import { generateToken, verifyToken } from '@/utils/token';

describe('JWT Token', () => {
  const payload = {
    userId: 'user-123',
    familyId: 'family-456',
    role: 'OWNER' as const,
  };

  test('should generate a token', async () => {
    const token = await generateToken(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT has 3 parts
  });

  test('should verify a valid token', async () => {
    const token = await generateToken(payload);
    const decoded = await verifyToken(token);

    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.familyId).toBe(payload.familyId);
    expect(decoded?.role).toBe(payload.role);
  });

  test('should return null for invalid token', async () => {
    const decoded = await verifyToken('invalid-token');

    expect(decoded).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd backend
bun test tests/unit/utils/token.test.ts
```

Expected: FAIL

**Step 3: Implement JWT utilities**

```typescript
// backend/src/utils/token.ts
import { SignJWT, jwtVerify } from 'jose';
import { config } from '@/infrastructure/config';

interface TokenPayload {
  userId: string;
  familyId: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export async function generateToken(payload: TokenPayload): Promise<string> {
  const secret = new TextEncoder().encode(config.jwt.secret);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwt.expiresIn)
    .setIssuer('familytree-app')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(config.jwt.secret);
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'familytree-app',
    });
    return payload as TokenPayload;
  } catch {
    return null;
  }
}
```

**Step 4: Run test to verify it passes**

```bash
cd backend
bun test tests/unit/utils/token.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add backend/src/utils/token.ts backend/tests/unit/utils/token.test.ts
git commit -m "feat(backend): add JWT token generation and verification"
```

---

### Task 1.13: Create AuthService

**Files:**
- Create: `backend/src/application/services/AuthService.ts`
- Create: `backend/src/application/services/index.ts`
- Test: `backend/tests/unit/services/AuthService.test.ts`

**Step 1: Write failing test**

```typescript
// backend/tests/unit/services/AuthService.test.ts
import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { AuthService } from '@/application/services/AuthService';
import { IUserRepository } from '@/domain/interfaces';
import { ConflictError, UnauthorizedError } from '@/domain/errors';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepo: IUserRepository;

  beforeEach(() => {
    mockUserRepo = {
      findById: mock(),
      findByUsername: mock(),
      findByFamilyId: mock(),
      create: mock(),
      update: mock(),
      delete: mock(),
    };

    authService = new AuthService(mockUserRepo);
  });

  describe('register', () => {
    test('should register new user and return token', async () => {
      mockUserRepo.findByUsername = mock().mockResolvedValue(null);
      mockUserRepo.create = mock().mockResolvedValue({
        id: 'user-123',
        username: 'testuser',
        role: 'OWNER',
        familyId: 'family-123',
      });

      const result = await authService.register({
        username: 'testuser',
        password: 'TestPass123',
        familyName: 'Test Family',
      });

      expect(result.user.username).toBe('testuser');
      expect(result.token).toBeDefined();
    });

    test('should throw ConflictError for duplicate username', async () => {
      mockUserRepo.findByUsername = mock().mockResolvedValue({
        id: 'existing-user',
        username: 'testuser',
      });

      await expect(
        authService.register({
          username: 'testuser',
          password: 'TestPass123',
          familyName: 'Test Family',
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    test('should return token for valid credentials', async () => {
      const hashedPassword = await hashPassword('TestPass123');
      mockUserRepo.findByUsername = mock().mockResolvedValue({
        id: 'user-123',
        username: 'testuser',
        passwordHash: hashedPassword,
        role: 'OWNER',
        familyId: 'family-123',
      });

      const result = await authService.login({
        username: 'testuser',
        password: 'TestPass123',
      });

      expect(result.user.username).toBe('testuser');
      expect(result.token).toBeDefined();
    });

    test('should throw UnauthorizedError for invalid credentials', async () => {
      mockUserRepo.findByUsername = mock().mockResolvedValue(null);

      await expect(
        authService.login({
          username: 'testuser',
          password: 'TestPass123',
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd backend
bun test tests/unit/services/AuthService.test.ts
```

Expected: FAIL

**Step 3: Implement AuthService**

```typescript
// backend/src/application/services/AuthService.ts
import { IUserRepository } from '@/domain/interfaces';
import { ConflictError, UnauthorizedError, ValidationError } from '@/domain/errors';
import { hashPassword, verifyPassword } from '@/utils/hash';
import { generateToken } from '@/utils/token';
import { User } from '@/domain/entities';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  familyName: z.string().min(1).max(100),
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

interface RegisterInput {
  username: string;
  password: string;
  familyName: string;
}

interface LoginInput {
  username: string;
  password: string;
}

interface AuthResult {
  user: User;
  token: string;
}

export class AuthService {
  constructor(private userRepo: IUserRepository) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    // Validate input
    const validated = registerSchema.parse(input);

    // Check if username exists
    const existing = await this.userRepo.findByUsername(validated.username);
    if (existing) {
      throw new ConflictError('Username already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(validated.password);

    // Create user (family creation would be handled separately)
    const user = await this.userRepo.create({
      username: validated.username,
      passwordHash,
      role: 'OWNER',
      familyId: 'temp-family-id', // Will be updated after family creation
    });

    // Generate token
    const token = await generateToken({
      userId: user.id!,
      familyId: user.familyId,
      role: user.role,
    });

    return { user, token };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    // Validate input
    const validated = loginSchema.parse(input);

    // Find user
    const user = await this.userRepo.findByUsername(validated.username);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isValid = await verifyPassword(validated.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate token
    const token = await generateToken({
      userId: user.id!,
      familyId: user.familyId,
      role: user.role,
    });

    return { user, token };
  }
}
```

**Step 4: Create services index**

```typescript
// backend/src/application/services/index.ts
export { AuthService } from './AuthService';
```

**Step 5: Run test to verify it passes**

```bash
cd backend
bun test tests/unit/services/AuthService.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add backend/src/application/services/ backend/tests/unit/services/
git commit -m "feat(backend): implement AuthService with register and login"
```

---

### Task 1.14: Setup GraphQL with Pothos

**Files:**
- Create: `backend/src/presentation/graphql/schema/builder.ts`
- Create: `backend/src/presentation/graphql/schema/index.ts`
- Create: `backend/src/presentation/graphql/context.ts`

**Step 1: Create Pothos builder**

```typescript
// backend/src/presentation/graphql/schema/builder.ts
import SchemaBuilder from '@pothos/core';
import { Context } from './context';

export const builder = new SchemaBuilder<{
  Context: Context;
  Objects: {
    User: { id: string; username: string; role: string; familyId: string };
  };
}>({});
```

**Step 2: Create context type**

```typescript
// backend/src/presentation/graphql/context.ts
export interface Context {
  user?: {
    userId: string;
    familyId: string;
    role: 'OWNER' | 'EDITOR' | 'VIEWER';
  };
}
```

**Step 3: Create schema index**

```typescript
// backend/src/presentation/graphql/schema/index.ts
export { builder } from './builder';
export type { Context } from './context';
```

**Step 4: Commit**

```bash
git add backend/src/presentation/graphql/
git commit -m "feat(backend): setup GraphQL schema builder with Pothos"
```

---

### Task 1.15: Create Auth GraphQL Resolvers

**Files:**
- Create: `backend/src/presentation/graphql/schema/types/User.ts`
- Create: `backend/src/presentation/graphql/schema/inputs/AuthInputs.ts`
- Create: `backend/src/presentation/graphql/resolvers/AuthResolver.ts`
- Update: `backend/src/app.ts`

**Step 1: Create User type**

```typescript
// backend/src/presentation/graphql/schema/types/User.ts
import { builder } from '../builder';

builder.objectType('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    username: t.exposeString('username'),
    role: t.exposeString('role'),
    familyId: t.exposeID('familyId'),
  }),
});

builder.objectType('AuthPayload', {
  fields: (t) => ({
    user: t.expose('user', { type: 'User' }),
    token: t.exposeString('token'),
  }),
});
```

**Step 2: Create auth inputs**

```typescript
// backend/src/presentation/graphql/schema/inputs/AuthInputs.ts
import { builder } from '../builder';

const RegisterInput = builder.inputType('RegisterInput', {
  fields: (t) => ({
    username: t.string({ required: true }),
    password: t.string({ required: true }),
    familyName: t.string({ required: true }),
  }),
});

const LoginInput = builder.inputType('LoginInput', {
  fields: (t) => ({
    username: t.string({ required: true }),
    password: t.string({ required: true }),
  }),
});

export { RegisterInput, LoginInput };
```

**Step 3: Create auth resolver**

```typescript
// backend/src/presentation/graphql/resolvers/AuthResolver.ts
import { builder } from '../schema/builder';
import { RegisterInput, LoginInput } from '../schema/inputs/AuthInputs';
import { AuthService } from '@/application/services';
import { UserRepository } from '@/infrastructure/database/repositories';

const authService = new AuthService(new UserRepository());

builder.mutationType({
  fields: (t) => ({
    register: t.field({
      type: 'AuthPayload',
      args: {
        input: t.arg({ type: RegisterInput, required: true }),
      },
      resolve: async (_, { input }) => {
        return authService.register(input);
      },
    }),
    login: t.field({
      type: 'AuthPayload',
      args: {
        input: t.arg({ type: LoginInput, required: true }),
      },
      resolve: async (_, { input }) => {
        return authService.login(input);
      },
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    me: t.field({
      type: 'User',
      nullable: true,
      resolve: async (_, __, ctx) => {
        if (!ctx.user) return null;
        // Fetch user from database
        return null; // TODO: Implement
      },
    }),
  }),
});
```

**Step 4: Update app.ts to include GraphQL**

```typescript
// backend/src/app.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createYoga } from 'graphql-yoga';
import { builder } from './presentation/graphql/schema/builder';
import './presentation/graphql/resolvers/AuthResolver';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GraphQL
const schema = builder.toSchema();
const yoga = createYoga({
  schema,
  context: () => ({}),
});

app.all('/graphql', async (c) => {
  const response = await yoga.handle(c.req.raw);
  return response;
});

export { app };
```

**Step 5: Commit**

```bash
git add backend/src/presentation/graphql/ backend/src/app.ts
git commit -m "feat(backend): add GraphQL auth resolvers for register and login"
```

---

## Phase 1 Summary

After completing Phase 1, you will have:

- [x] Backend project initialized with Bun.js + Hono
- [x] Frontend project initialized with React + Vite
- [x] Docker infrastructure with MongoDB and MinIO
- [x] Domain layer with entities and value objects
- [x] Infrastructure layer with repositories
- [x] Application layer with AuthService
- [x] GraphQL API with auth endpoints
- [x] Password hashing and JWT tokens

**Next Phase:** Phase 2 will add Member CRUD, Relationships, Media uploads, and Basic Tree Visualization.

---

## Phase 2: Core Features (Week 2-3)

*Note: Phase 2 tasks will follow the same TDD pattern with detailed steps. Each task includes:*
1. Write failing test
2. Run test to verify failure
3. Implement minimal code
4. Run test to verify pass
5. Commit

### Task 2.1: Create Member Entity and Model
### Task 2.2: Implement MemberRepository
### Task 2.3: Create MemberService
### Task 2.4: Create Member GraphQL Resolvers
### Task 2.5: Create Relationship Entity and Model
### Task 2.6: Implement RelationshipRepository
### Task 2.7: Create RelationshipService
### Task 2.8: Create Relationship GraphQL Resolvers
### Task 2.9: Setup MinIO Service
### Task 2.10: Create Media Entity and Model
### Task 2.11: Implement MediaRepository
### Task 2.12: Create MediaService
### Task 2.13: Create Media GraphQL Resolvers
### Task 2.14: Frontend - Setup Apollo Client
### Task 2.15: Frontend - Create Auth Pages
### Task 2.16: Frontend - Create Member List Page
### Task 2.17: Frontend - Create Member Form Page
### Task 2.18: Frontend - Create Basic Tree Chart

---

## Phase 3: Enhanced Features (Week 4)

### Task 3.1: Implement Relationship Calculator
### Task 3.2: Create CalculatedRelationship Resolver
### Task 3.3: Implement Search Service
### Task 3.4: Create Search Resolvers
### Task 3.5: Implement Share Service
### Task 3.6: Create Share Resolvers
### Task 3.7: Frontend - Implement Graph View
### Task 3.8: Frontend - Implement Timeline View
### Task 3.9: Frontend - Implement List View
### Task 3.10: Frontend - Implement Search Component
### Task 3.11: Frontend - Implement Share Dialog

---

## Phase 4: Polish (Week 5)

### Task 4.1: Setup i18n with react-i18next
### Task 4.2: Create English Translations
### Task 4.3: Create Vietnamese Translations
### Task 4.4: Implement Language Switcher
### Task 4.5: Create Timeline Entity and Model
### Task 4.6: Implement Timeline Service
### Task 4.7: Create Timeline Resolvers
### Task 4.8: Frontend - Timeline Page
### Task 4.9: Create Source Entity and Model
### Task 4.10: Implement Source Service
### Task 4.11: Frontend - User Management Page
### Task 4.12: Implement User Management Service
### Task 4.13: Create User Management Resolvers
### Task 4.14: Write E2E Tests
### Task 4.15: Generate API Documentation
### Task 4.16: Final Testing and Coverage
### Task 4.17: Deploy with Docker Compose

---

## Execution Handoff

Plan complete and saved to `docs/plans/2026-03-07-family-tree-implementation.md`.

**Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
