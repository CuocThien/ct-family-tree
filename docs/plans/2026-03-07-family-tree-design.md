# Family Tree V2 - Design Document

**Date:** 2026-03-07
**Status:** Approved
**Author:** Design Session

---

## Overview

Family Tree V2 is a multi-family SaaS platform for managing genealogy and family history. It allows multiple families to create private family trees with extensive member information, relationships, media, and documentation.

---

## Architecture

### Hybrid Clean Architecture

The project uses a hybrid approach combining Clean Architecture principles with pragmatic simplifications:

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│  Features: auth, family, member, tree, media, timeline          │
│  State: Jotai (atomic)  |  UI: Ant Design + Tailwind CSS       │
│  GraphQL: Apollo Client + Generated Types                       │
└─────────────────────────────────────────────────────────────────┘
                              │ GraphQL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Bun.js)                           │
│  Presentation: GraphQL Resolvers, Middleware (auth, validation) │
│  Application: Services (business logic, orchestration)          │
│  Domain: Entities, Value Objects, Repository Interfaces         │
│  Infrastructure: MongoDB, MinIO, Repositories                   │
└─────────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
  ┌─────────────┐              ┌─────────────┐
  │   MongoDB   │              │    MinIO    │
  └─────────────┘              └─────────────┘
```

### Repository Structure

```
FamilyTreeV2/
├── frontend/                    # React + Vite + TypeScript
├── backend/                     # Bun.js + TypeScript
├── docs/                        # Documentation
├── scripts/                     # Utility scripts
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── README.md
└── CLAUDE.md
```

---

## Data Model

### Core Entities

| Entity | Description |
|--------|-------------|
| **User** | Platform user with role (OWNER, EDITOR, VIEWER) |
| **Family** | Family tree container with settings and share links |
| **Member** | Family member with personal info, life events, education |
| **Relationship** | Base relationships (parent, spouse, partner, adoption) |
| **Media** | Files (photos, documents, videos) stored in MinIO |
| **Source** | Citations and references for genealogical data |
| **TimelineEvent** | Life events involving one or more members |

### Value Objects

| Value Object | Description |
|--------------|-------------|
| **PartialDate** | Date with optional month/day (genealogical standard) |
| **Address** | Location with optional coordinates |
| **LifeEvent** | Embedded in Member: birth, death, marriage, work, custom |
| **Education** | Institution, degree, dates |
| **ContactInfo** | Email, phone, address |
| **MedicalInfo** | Optional health information |

### Key Relationships

- **User → Family**: Many-to-one (users belong to one family)
- **Family → Member**: One-to-many
- **Member → Member**: Through Relationship entity
- **Member → Media**: One-to-many
- **Member → Source**: Through MemberSource junction

---

## API Design (GraphQL)

### Key Queries

```graphql
# Auth
me: User

# Family
family(id: ID!): Family
myFamily: Family

# Members
member(id: ID!): Member
members(familyId: ID!, filter: MemberFilter): MemberConnection!
searchMembers(familyId: ID!, query: String!, limit: Int): [Member!]!

# Relationships
relationships(familyId: ID!, memberId: ID): [Relationship!]!
calculatedRelationship(fromMemberId: ID!, toMemberId: ID!): CalculatedRelationship

# Sharing
validateShareLink(token: String!, password: String): ShareLinkValidation
```

### Key Mutations

```graphql
# Auth
register(input: RegisterInput!): AuthPayload!
login(input: LoginInput!): AuthPayload!
logout: Boolean!

# Members (Owner/Editor)
createMember(input: CreateMemberInput!): Member!
updateMember(input: UpdateMemberInput!): Member!
deleteMember(id: ID!): Boolean!

# Relationships (Owner/Editor)
createRelationship(input: CreateRelationshipInput!): Relationship!
deleteRelationship(id: ID!): Boolean!

# Media (Owner/Editor)
uploadMedia(input: UploadMediaInput!): Media!
deleteMedia(id: ID!): Boolean!

# Sharing (Owner)
createShareLink(input: CreateShareLinkInput!): ShareLink!
revokeShareLink(token: String!): Boolean!

# User Management (Owner)
createUser(input: CreateUserInput!): User!
updateUserRole(input: UpdateUserRoleInput!): User!
resetUserPassword(input: ResetUserPasswordInput!): Boolean!
deleteUser(id: ID!): Boolean!
```

---

## Frontend Architecture

### Technology Stack

| Category | Technology |
|----------|------------|
| Build | Vite |
| Framework | React 18 |
| Language | TypeScript |
| State | Jotai (atomic) |
| GraphQL | Apollo Client |
| Routing | React Router v6 |
| UI | Ant Design + Tailwind CSS |
| Forms | React Hook Form + Zod |
| i18n | react-i18next |
| Visualization | D3.js + react-flow |
| Testing | Vitest + Playwright |

### Feature Modules

```
src/features/
├── auth/           # Login, Register, Protected routes
├── family/         # Dashboard, Settings, Share management
├── member/         # CRUD, Search, Detail views
├── tree/           # Tree, Graph, Timeline, List views
├── relationship/   # Relationship management
├── media/          # Upload, Gallery, Viewer
├── source/         # Sources and citations
├── timeline/       # Family timeline
└── user-management/# User CRUD (Owner only)
```

### Tree Visualization Views

1. **Tree Chart** - Traditional pedigree chart with pan/zoom
2. **Graph View** - Force-directed interactive graph
3. **Timeline View** - Chronological event display
4. **List View** - Collapsible nested hierarchy

---

## Backend Architecture

### Technology Stack

| Category | Technology |
|----------|------------|
| Runtime | Bun |
| Framework | Hono |
| Language | TypeScript |
| GraphQL | Pothos (type-safe schema builder) |
| Database | MongoDB + Mongoose |
| Validation | Zod |
| Auth | JWT (jose library) |
| Storage | MinIO |
| Testing | Bun test |

### Layer Structure

```
src/
├── presentation/     # GraphQL resolvers, middleware
├── application/      # Services, DTOs
├── domain/           # Entities, value objects, interfaces
├── infrastructure/   # MongoDB, MinIO, repositories
└── utils/            # Helpers
```

---

## Security

### Authentication

- Username/password only (no email/social)
- JWT tokens (HS256, 7-day expiration)
- Password: bcrypt (12 rounds)

### Authorization

| Role | Permissions |
|------|-------------|
| OWNER | Full access + user management |
| EDITOR | Create, edit, delete members/relationships/media |
| VIEWER | Read-only access |

### Security Measures

- HTTPS (production)
- Security headers (X-Frame-Options, CSP, etc.)
- CORS with origin whitelist
- Rate limiting (100 req / 15 min per IP)
- Input validation (Zod schemas)
- File upload validation (MIME, size)
- Share link token hashing

---

## Infrastructure

### Docker Services

| Service | Purpose |
|---------|---------|
| frontend | React app (nginx) |
| backend | Bun.js API |
| mongodb | Database (MongoDB 7.0) |
| minio | Object storage (S3-compatible) |
| backup | Scheduled backup service |

### CI/CD (GitHub Actions)

1. **Test** - Run tests on every PR
2. **Build** - Build Docker images on main branch
3. **Deploy** - Deploy to server on main branch

### Backup Strategy

- Daily automated backups (2 AM)
- Stored in MinIO
- 30-day retention

---

## Testing Strategy

### Coverage Targets

| Layer | Target |
|-------|--------|
| Domain | 95%+ |
| Application | 90%+ |
| Presentation | 70%+ |
| Infrastructure | 60%+ |

### Test Types

- **Unit Tests** - Entities, value objects, services
- **Integration Tests** - Repositories, GraphQL resolvers
- **E2E Tests** - Critical user flows (Playwright)

### TDD Approach

Tests written before implementation. Pre-commit hooks run linting and related tests.

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

- Project setup
- Database models
- Authentication
- Basic API

### Phase 2: Core Features (Week 2-3)

- Member CRUD
- Basic tree visualization
- Relationships
- File uploads

### Phase 3: Enhanced Features (Week 4)

- Calculated relationships
- Multiple tree views
- Search
- Sharing

### Phase 4: Polish (Week 5)

- i18n (EN/VI)
- Timeline & sources
- User management
- Testing & documentation

---

## Future Enhancements

- GEDCOM import/export
- Advanced search (Elasticsearch)
- Real-time collaboration (WebSockets)
- Mobile app (React Native)
- Map integration
- DNA matching
- PDF export
