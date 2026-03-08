# Family Tree V2 - Phase 1: Foundation - Complete Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the foundation layer for Family Tree V2 including backend, frontend, Docker infrastructure, database, authentication, and basic GraphQL API.

**Architecture:** Hybrid Clean Architecture with Domain, Application, Infrastructure, and Presentation layers. Bun.js backend with Hono + Pothos (GraphQL). React frontend with Vite + Apollo Client + Jotai.

**Tech Stack:**
- Backend: Bun.js, Hono, Pothos, MongoDB, Mongoose, MinIO, Zod
- Frontend: React, Vite, TypeScript, Ant Design, Tailwind CSS, Jotai, Apollo Client
- Infrastructure: Docker, Docker Compose

---

## Task Index

| Task | Name | Status | Plan File |
|------|------|--------|-----------|
| 1.1 | Initialize Backend Project | ✅ Planned | `2026-03-07-task-1.1-implementation.md` |
| 1.2 | Initialize Frontend Project | ✅ Planned | `2026-03-07-task-1.2-implementation.md` |
| 1.3 | Setup Docker Infrastructure | 📋 Below | See Task 1.3 |
| 1.4 | Setup MongoDB Connection | 📋 Below | See Task 1.4 |
| 1.5 | Create Domain Errors | 📋 Below | See Task 1.5 |
| 1.6 | Create Domain Value Objects | 📋 Below | See Task 1.6 |
| 1.7 | Create User Entity | 📋 Below | See Task 1.7 |
| 1.8 | Create Mongoose Models | 📋 Below | See Task 1.8 |
| 1.9 | Create Repository Interfaces | 📋 Below | See Task 1.9 |
| 1.10 | Implement UserRepository | 📋 Below | See Task 1.10 |
| 1.11 | Implement Password Hashing | 📋 Below | See Task 1.11 |
| 1.12 | Implement JWT Token Utilities | 📋 Below | See Task 1.12 |
| 1.13 | Create AuthService | 📋 Below | See Task 1.13 |
| 1.14 | Setup GraphQL with Pothos | 📋 Below | See Task 1.14 |
| 1.15 | Create Auth GraphQL Resolvers | 📋 Below | See Task 1.15 |

---

## Task 1.3: Setup Docker Infrastructure

### Files
- Create: `docker-compose.yml`
- Create: `docker-compose.dev.yml`
- Create: `scripts/mongo-init.js`
- Update: `.env.example`

### Atomic Steps

**Step 1: Create docker-compose.yml**
```yaml
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

**Step 3: Create scripts/mongo-init.js**
```javascript
db = db.getSiblingDB('familytree');

db.createCollection('users');
db.createCollection('families');
db.createCollection('members');
db.createCollection('relationships');
db.createCollection('media');
db.createCollection('sources');
db.createCollection('timelines');

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
db.sources.createIndex({ familyId: 1 });
db.timelines.createIndex({ familyId: 1 });

print('Database initialized successfully');
```

**Step 4: Start Docker services**
```bash
cp .env.example .env
docker-compose up -d
docker-compose ps
```

**Verification:**
- MongoDB accessible at localhost:27017
- MinIO accessible at localhost:9000, console at localhost:9001

---

## Task 1.4: Setup MongoDB Connection

### Files
- Create: `backend/src/infrastructure/database/connection.ts`

### Atomic Steps

**Step 1: Write failing test** - `backend/tests/unit/infrastructure/database.test.ts`
```typescript
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { connectToDatabase, disconnectFromDatabase } from '@/infrastructure/database/connection';

describe('Database Connection', () => {
  test('should connect to MongoDB', async () => {
    await connectToDatabase();
    expect(true).toBe(true);
  });

  test('should disconnect from MongoDB', async () => {
    await disconnectFromDatabase();
    expect(true).toBe(true);
  });
});
```

**Step 2: Run test to verify failure**
```bash
bun test tests/unit/infrastructure/database.test.ts
```

**Step 3: Implement connection.ts**
```typescript
import mongoose from 'mongoose';
import { config } from '@/infrastructure/config';

let isConnected = false;

export async function connectToDatabase(): Promise<void> {
  if (isConnected) return;
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
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('📦 Disconnected from MongoDB');
}

export function getDatabaseConnectionStatus(): boolean {
  return isConnected;
}
```

**Step 4: Run test to verify pass**
**Step 5: Commit**

---

## Task 1.5: Create Domain Errors

### Files
- Create: `backend/src/domain/errors/DomainError.ts`
- Create: `backend/src/domain/errors/NotFoundError.ts`
- Create: `backend/src/domain/errors/UnauthorizedError.ts`
- Create: `backend/src/domain/errors/ValidationError.ts`
- Create: `backend/src/domain/errors/ConflictError.ts`
- Create: `backend/src/domain/errors/index.ts`
- Test: `backend/tests/unit/domain/errors/`

### Atomic Steps

**Step 1: Write failing tests**
```typescript
import { describe, test, expect } from 'bun:test';
import { DomainError, NotFoundError, UnauthorizedError, ValidationError, ConflictError } from '@/domain/errors';

describe('Domain Errors', () => {
  test('DomainError has correct name and message', () => {
    const error = new DomainError('Test error');
    expect(error.name).toBe('DomainError');
    expect(error.message).toBe('Test error');
  });

  test('NotFoundError formats message correctly', () => {
    const error = new NotFoundError('Member', '123');
    expect(error.message).toBe('Member with id 123 not found');
  });
});
```

**Step 2: Implement error classes**
```typescript
// DomainError.ts
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

// NotFoundError.ts
export class NotFoundError extends DomainError {
  constructor(entity: string, identifier: string) {
    super(`${entity} with id ${identifier} not found`);
    this.name = 'NotFoundError';
  }
}

// UnauthorizedError.ts
export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// ValidationError.ts
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ConflictError.ts
export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
```

**Step 3: Run tests, verify pass, commit**

---

## Task 1.6: Create Domain Value Objects

### Files
- Create: `backend/src/domain/value-objects/PartialDate.ts`
- Create: `backend/src/domain/value-objects/Address.ts`
- Create: `backend/src/domain/value-objects/LifeEvent.ts`
- Create: `backend/src/domain/value-objects/index.ts`
- Test: `backend/tests/unit/domain/value-objects/`

### Key Implementation

**PartialDate.ts**
```typescript
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
    if (props.year < 1 || props.year > 2100) {
      throw new ValidationError('Year must be between 1 and 2100');
    }
    if (props.month !== undefined && (props.month < 1 || props.month > 12)) {
      throw new ValidationError('Month must be between 1 and 12');
    }
    if (props.day !== undefined && (props.day < 1 || props.day > 31)) {
      throw new ValidationError('Day must be between 1 and 31');
    }
    return new PartialDate(props);
  }

  toDate(): Date {
    return new Date(this.year, (this.month ?? 1) - 1, this.day ?? 1);
  }

  format(): string {
    const year = this.year.toString();
    const month = this.month?.toString().padStart(2, '0') ?? '';
    const day = this.day?.toString().padStart(2, '0') ?? '';
    if (this.month && this.day) return `${year}-${month}-${day}`;
    if (this.month) return `${year}-${month}`;
    return year;
  }

  toJSON() {
    return { year: this.year, month: this.month, day: this.day, isApproximate: this.isApproximate };
  }
}
```

---

## Task 1.7: Create User Entity

### Files
- Create: `backend/src/domain/entities/User.ts`
- Create: `backend/src/domain/entities/index.ts`
- Test: `backend/tests/unit/domain/entities/User.test.ts`

### Key Implementation

```typescript
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
    if (!props.username || props.username.length < 3 || props.username.length > 30) {
      throw new ValidationError('Username must be between 3 and 30 characters');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(props.username)) {
      throw new ValidationError('Username can only contain letters, numbers, and underscores');
    }
    const validRoles: UserRole[] = ['OWNER', 'EDITOR', 'VIEWER'];
    if (!validRoles.includes(props.role)) {
      throw new ValidationError('Invalid role');
    }
    return new User(props);
  }

  isOwner(): boolean { return this.role === 'OWNER'; }
  canEdit(): boolean { return this.role === 'OWNER' || this.role === 'EDITOR'; }

  toJSON() {
    return {
      id: this.id, username: this.username, role: this.role,
      familyId: this.familyId, memberProfileId: this.memberProfileId,
      createdAt: this.createdAt, updatedAt: this.updatedAt,
    };
  }
}
```

---

## Task 1.8: Create Mongoose Models

### Files
- Create: `backend/src/infrastructure/database/models/User.ts`
- Create: `backend/src/infrastructure/database/models/Family.ts`
- Create: `backend/src/infrastructure/database/models/index.ts`

### Key Implementation

**User.ts**
```typescript
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
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30, match: /^[a-zA-Z0-9_]+$/ },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['OWNER', 'EDITOR', 'VIEWER'], required: true },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family', required: true },
    memberProfileId: { type: Schema.Types.ObjectId, ref: 'Member' },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
```

---

## Task 1.9: Create Repository Interfaces

### Files
- Create: `backend/src/domain/interfaces/IUserRepository.ts`
- Create: `backend/src/domain/interfaces/IFamilyRepository.ts`
- Create: `backend/src/domain/interfaces/index.ts`

### Key Implementation

```typescript
// IUserRepository.ts
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

---

## Task 1.10: Implement UserRepository

### Files
- Create: `backend/src/infrastructure/database/repositories/UserRepository.ts`
- Create: `backend/src/infrastructure/database/repositories/index.ts`
- Test: `backend/tests/integration/repositories/UserRepository.test.ts`

### Key Implementation

```typescript
import { User, UserRole } from '@/domain/entities';
import { IUserRepository, CreateUserInput } from '@/domain/interfaces';
import { UserModel } from '../models';
import { NotFoundError } from '@/domain/errors';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const doc = await UserModel.findOne({ username });
    return doc ? this.toEntity(doc) : null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const doc = await UserModel.create(input);
    return this.toEntity(doc);
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const doc = await UserModel.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
    if (!doc) throw new NotFoundError('User', id);
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async findByFamilyId(familyId: string): Promise<User[]> {
    const docs = await UserModel.find({ familyId });
    return docs.map(doc => this.toEntity(doc));
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

---

## Task 1.11: Implement Password Hashing

### Files
- Create: `backend/src/utils/hash.ts`
- Test: `backend/tests/unit/utils/hash.test.ts`

### Key Implementation

```typescript
import { hash, verify } from 'bun';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, { algorithm: 'bcrypt', cost: SALT_ROUNDS });
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await verify(password, hashedPassword, 'bcrypt');
}
```

---

## Task 1.12: Implement JWT Token Utilities

### Files
- Create: `backend/src/utils/token.ts`
- Test: `backend/tests/unit/utils/token.test.ts`

### Key Implementation

```typescript
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
    const { payload } = await jwtVerify(token, secret, { issuer: 'familytree-app' });
    return payload as TokenPayload;
  } catch {
    return null;
  }
}
```

---

## Task 1.13: Create AuthService

### Files
- Create: `backend/src/application/services/AuthService.ts`
- Create: `backend/src/application/services/index.ts`
- Test: `backend/tests/unit/services/AuthService.test.ts`

### Key Implementation

```typescript
import { IUserRepository, CreateUserInput } from '@/domain/interfaces';
import { ConflictError, UnauthorizedError } from '@/domain/errors';
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

export class AuthService {
  constructor(private userRepo: IUserRepository) {}

  async register(input: { username: string; password: string; familyName: string }) {
    const validated = registerSchema.parse(input);
    const existing = await this.userRepo.findByUsername(validated.username);
    if (existing) throw new ConflictError('Username already exists');

    const passwordHash = await hashPassword(validated.password);
    const user = await this.userRepo.create({
      username: validated.username,
      passwordHash,
      role: 'OWNER',
      familyId: 'temp-family-id', // Updated after family creation
    });

    const token = await generateToken({ userId: user.id!, familyId: user.familyId, role: user.role });
    return { user, token };
  }

  async login(input: { username: string; password: string }) {
    const validated = loginSchema.parse(input);
    const user = await this.userRepo.findByUsername(validated.username);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isValid = await verifyPassword(validated.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    const token = await generateToken({ userId: user.id!, familyId: user.familyId, role: user.role });
    return { user, token };
  }
}
```

---

## Task 1.14: Setup GraphQL with Pothos

### Files
- Create: `backend/src/presentation/graphql/schema/builder.ts`
- Create: `backend/src/presentation/graphql/schema/index.ts`
- Create: `backend/src/presentation/graphql/context.ts`

### Key Implementation

```typescript
// builder.ts
import SchemaBuilder from '@pothos/core';
import { Context } from './context';

export const builder = new SchemaBuilder<{
  Context: Context;
  Objects: {
    User: { id: string; username: string; role: string; familyId: string };
  };
>({});

// context.ts
export interface Context {
  user?: {
    userId: string;
    familyId: string;
    role: 'OWNER' | 'EDITOR' | 'VIEWER';
  };
}
```

---

## Task 1.15: Create Auth GraphQL Resolvers

### Files
- Create: `backend/src/presentation/graphql/schema/types/User.ts`
- Create: `backend/src/presentation/graphql/schema/inputs/AuthInputs.ts`
- Create: `backend/src/presentation/graphql/resolvers/AuthResolver.ts`
- Update: `backend/src/app.ts`

### Key Implementation

```typescript
// types/User.ts
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

// resolvers/AuthResolver.ts
import { builder } from '../schema/builder';
import { RegisterInput, LoginInput } from '../schema/inputs/AuthInputs';
import { AuthService } from '@/application/services';
import { UserRepository } from '@/infrastructure/database/repositories';

const authService = new AuthService(new UserRepository());

builder.mutationType({
  fields: (t) => ({
    register: t.field({
      type: 'AuthPayload',
      args: { input: t.arg({ type: RegisterInput, required: true }) },
      resolve: async (_, { input }) => authService.register(input),
    }),
    login: t.field({
      type: 'AuthPayload',
      args: { input: t.arg({ type: LoginInput, required: true }) },
      resolve: async (_, { input }) => authService.login(input),
    }),
  }),
});
```

---

## Success Criteria - Phase 1 Complete

- [ ] Backend project initialized with Bun.js + Hono
- [ ] Frontend project initialized with React + Vite
- [ ] Docker infrastructure running (MongoDB, MinIO)
- [ ] MongoDB connection working
- [ ] Domain layer complete (entities, value objects, errors)
- [ ] Mongoose models created
- [ ] Repositories implemented
- [ ] Password hashing working
- [ ] JWT token generation/verification working
- [ ] AuthService with register/login
- [ ] GraphQL API with auth endpoints
- [ ] Health check endpoint working
- [ ] Test coverage > 80%

---

## Next Steps

After Phase 1 completion, proceed to:
- **Phase 2**: Core Features (Member CRUD, Relationships, Media, Tree Visualization)
- **Phase 3**: Enhanced Features (Calculated Relationships, Search, Sharing)
- **Phase 4**: Polish (i18n, Timeline, Sources, User Management, Documentation)
