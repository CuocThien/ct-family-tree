# CLAUDE.md

This file provides guidance for Claude Code when working with the Family Tree V2 project.

## Project Overview

Family Tree V2 is a multi-family SaaS platform for genealogy management. It's a monolithic application with separate frontend (React) and backend (Bun.js) repositories.

## Architecture

### Hybrid Clean Architecture

The project follows Clean Architecture with pragmatic simplifications:

- **Presentation Layer**: GraphQL resolvers, middleware
- **Application Layer**: Services (business logic)
- **Domain Layer**: Entities, value objects, interfaces (no external dependencies)
- **Infrastructure Layer**: MongoDB, MinIO, repositories

### Key Principles

1. **SOLID Principles**
   - Single Responsibility: Each service handles one domain
   - Open/Closed: Easy to extend without modification
   - Liskov Substitution: Repository interfaces allow swapping implementations
   - Interface Segregation: Small, focused interfaces
   - Dependency Inversion: Depend on abstractions, not implementations

2. **Dependency Flow**
   ```
   Presentation → Application → Domain ← Infrastructure
   ```
   Domain layer has NO external dependencies.

## Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- Jotai for state management (atomic)
- Apollo Client for GraphQL
- Ant Design + Tailwind CSS for UI
- D3.js + react-flow for visualization

### Backend
- Bun.js runtime
- Hono framework
- Pothos for GraphQL schema
- MongoDB + Mongoose
- MinIO for file storage

## Project Structure

```
FamilyTreeV2/
├── frontend/
│   └── src/
│       ├── app/              # App config, providers, router
│       ├── features/         # Feature modules
│       │   ├── auth/
│       │   ├── family/
│       │   ├── member/
│       │   ├── tree/
│       │   ├── media/
│       │   └── ...
│       ├── shared/           # Shared components, hooks, utils
│       ├── graphql/          # Apollo client, generated types
│       └── i18n/             # Translations
│
├── backend/
│   └── src/
│       ├── presentation/     # GraphQL resolvers, middleware
│       │   ├── graphql/
│       │   └── middleware/
│       ├── application/      # Services, DTOs
│       │   ├── services/
│       │   └── dto/
│       ├── domain/           # Entities, value objects, interfaces
│       │   ├── entities/
│       │   ├── value-objects/
│       │   ├── errors/
│       │   └── interfaces/
│       └── infrastructure/   # Database, storage, repositories
│           ├── database/
│           ├── storage/
│           └── config/
│
└── docs/
    ├── plans/                # Design documents
    ├── technical-decision.md # Architecture decisions
    └── requirement.md        # Requirements
```

## Coding Conventions

### TypeScript

- Strict mode enabled
- Use interfaces for contracts, types for shapes
- Avoid `any` - use `unknown` when type is uncertain
- Use Zod for runtime validation

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files (components) | PascalCase | `MemberCard.tsx` |
| Files (utilities) | camelCase | `formatters.ts` |
| Files (tests) | .test.ts(x) | `Member.test.ts` |
| Interfaces | I prefix for repositories | `IMemberRepository` |
| Classes | PascalCase | `MemberService` |
| Functions | camelCase | `calculateRelationship` |
| Constants | SCREAMING_SNAKE | `MAX_FILE_SIZE` |
| GraphQL types | PascalCase | `CreateMemberInput` |

### React

- Functional components only
- Use hooks for state and side effects
- Jotai atoms for global state
- React Hook Form + Zod for forms

### Backend

- Services for business logic
- Repositories for data access
- Domain entities for core models
- Zod schemas for validation

## GraphQL Conventions

### Schema Organization

- Types in `presentation/graphql/schema/types/`
- Inputs in `presentation/graphql/schema/inputs/`
- Resolvers in `presentation/graphql/resolvers/`

### Naming

- Mutations: `createX`, `updateX`, `deleteX`
- Queries: `x` (single), `xList` or `xs` (list)
- Inputs: `CreateXInput`, `UpdateXInput`
- Payloads: `XPayload` for complex returns

### Pagination

Use cursor-based pagination for lists:

```graphql
type MemberConnection {
  edges: [MemberEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```

## Authentication & Authorization

### Roles

| Role | Permissions |
|------|-------------|
| OWNER | Everything + user management |
| EDITOR | CRUD on members, relationships, media |
| VIEWER | Read-only |

### Middleware

```typescript
// Require authentication
@UseMiddleware(requireAuth)

// Require specific role
@UseMiddleware(requireRole('OWNER', 'EDITOR'))
```

## Testing

### TDD Approach

1. Write failing test
2. Implement minimal code to pass
3. Refactor

### Coverage Requirements

| Layer | Target |
|-------|--------|
| Domain | 95%+ |
| Application | 90%+ |
| Presentation | 70%+ |

### Test Location

- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`

### Running Tests

```bash
# Backend
bun test
bun test:coverage

# Frontend
npm run test
npm run test:coverage
npm run test:e2e
```

## Database

### MongoDB Collections

- `users` - User accounts
- `families` - Family trees
- `members` - Family members
- `relationships` - Member relationships
- `media` - File metadata
- `sources` - Citations
- `timelines` - Timeline events

### Mongoose Models

Located in `infrastructure/database/models/`

### Relationships

- Use ObjectId references
- Mongoose populate for joins
- Indexes on frequently queried fields

## File Storage

### MinIO

- S3-compatible storage
- Buckets: `familytree-media`, `backups`
- Presigned URLs for secure access

### File Validation

```typescript
const ALLOWED_TYPES = {
  PHOTO: ['image/jpeg', 'image/png', 'image/webp'],
  DOCUMENT: ['application/pdf'],
  VIDEO: ['video/mp4', 'video/webm'],
};

const MAX_SIZES = {
  PHOTO: 10 * 1024 * 1024,    // 10MB
  DOCUMENT: 25 * 1024 * 1024, // 25MB
  VIDEO: 100 * 1024 * 1024,   // 100MB
};
```

## Internationalization

- react-i18next for frontend
- Languages: English (`en`), Vietnamese (`vi`)
- Translation files: `public/locales/{en,vi}/translation.json`
- Language stored in localStorage (not user profile)
- Simple switch button, no per-user setting

## Docker

### Services

- `frontend` - React app (nginx)
- `backend` - Bun.js API
- `mongodb` - Database
- `minio` - File storage
- `backup` - Scheduled backups

### Commands

```bash
# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Production
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Rebuild specific service
docker-compose up -d --build backend
```

## Common Tasks

### Adding a New Feature

1. Define domain entity/value object
2. Create repository interface (in domain)
3. Write tests for service
4. Implement service
5. Implement repository
6. Create GraphQL types and resolvers
7. Add frontend components
8. Add translations

### Adding a New API Endpoint

1. Define input/output types in GraphQL schema
2. Add Zod validation schema
3. Implement resolver
4. Add service method if needed
5. Write tests

### Debugging

```bash
# Backend logs
docker-compose logs -f backend

# MongoDB queries
docker-compose exec mongodb mongosh

# MinIO console
open http://localhost:9001
```

## Security Considerations

- Never commit `.env` files
- JWT tokens expire after 7 days
- Rate limiting: 100 requests per 15 minutes
- File uploads validated by MIME type and size
- Share link tokens are hashed before storage
- Passwords hashed with bcrypt (12 rounds)

## Performance Tips

- Use MongoDB indexes on queried fields
- Use cursor-based pagination for large lists
- Lazy load tree visualization components
- Optimize images before upload (frontend)
- Use presigned URLs for media access
- Consider caching calculated relationships

## Known Limitations

- No real-time updates (refresh required)
- No email notifications
- No self-service password reset
- Share links provide view-only access
- Maximum 10,000 members per family
- Maximum 100GB storage per family
