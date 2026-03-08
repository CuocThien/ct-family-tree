# Family Tree V2

A modern, full-featured family tree management application built with Clean Architecture and SOLID principles.

## Overview

Family Tree V2 is a multi-family SaaS platform for managing genealogy and family history. It enables families to create private family trees with extensive member profiles, relationship tracking, media management, and multiple visualization options.

## Features

- **Multi-family Support** - Each family has their own private tree
- **Role-based Access** - Owner, Editor, and Viewer roles
- **Comprehensive Member Profiles** - Personal info, life events, education, contact details
- **Relationship Tracking** - Base relationships with automatic derived relationship calculation
- **Multiple Visualization Views** - Tree chart, graph view, timeline, and list view
- **Media Management** - Photos, documents, and videos with MinIO storage
- **Source Citations** - Track sources for genealogical accuracy
- **Timeline Events** - Document important family events
- **Share Links** - Share tree with optional password protection
- **Bilingual** - English and Vietnamese support

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Jotai** - State management
- **Apollo Client** - GraphQL client
- **Ant Design** - UI components
- **Tailwind CSS** - Styling
- **D3.js** - Tree visualization

### Backend
- **Bun.js** - Runtime
- **Hono** - Web framework
- **TypeScript** - Type safety
- **Pothos** - GraphQL schema builder
- **MongoDB** - Database
- **Mongoose** - ODM
- **MinIO** - File storage

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **GitHub Actions** - CI/CD

## Project Structure

```
FamilyTreeV2/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── app/                # App configuration
│   │   ├── features/           # Feature modules
│   │   ├── shared/             # Shared components
│   │   ├── graphql/            # GraphQL client
│   │   └── i18n/               # Translations
│   ├── public/
│   ├── tests/
│   └── package.json
│
├── backend/                     # Bun.js backend
│   ├── src/
│   │   ├── presentation/       # GraphQL resolvers
│   │   ├── application/        # Services
│   │   ├── domain/             # Entities, value objects
│   │   └── infrastructure/     # Database, storage
│   ├── tests/
│   └── package.json
│
├── docs/                        # Documentation
│   ├── plans/                  # Design documents
│   ├── technical-decision.md   # ADRs
│   └── requirement.md          # Requirements
│
├── scripts/                     # Utility scripts
├── docker-compose.yml          # Production compose
├── docker-compose.dev.yml      # Development compose
├── .env.example                # Environment template
├── README.md                   # This file
└── CLAUDE.md                   # AI assistant guide
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Bun (for local backend development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FamilyTreeV2
   ```

2. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start services with Docker**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend GraphQL: http://localhost:4000/graphql
   - MinIO Console: http://localhost:9001

### Local Development (without Docker)

1. **Start MongoDB and MinIO**
   ```bash
   docker-compose up -d mongodb minio
   ```

2. **Backend**
   ```bash
   cd backend
   bun install
   bun run dev
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Testing

### Backend Tests
```bash
cd backend
bun test                    # Run all tests
bun test:coverage           # Run with coverage
```

### Frontend Tests
```bash
cd frontend
npm run test                # Unit tests
npm run test:e2e            # E2E tests
npm run test:coverage       # Coverage report
```

## Deployment

### Production Deployment

1. **Set environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Build and start**
   ```bash
   docker-compose up -d --build
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `MONGO_ROOT_PASSWORD` | MongoDB root password | Yes |
| `MINIO_ACCESS_KEY` | MinIO access key | Yes |
| `MINIO_SECRET_KEY` | MinIO secret key | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `RATE_LIMIT_MAX` | Max requests per window | No (default: 100) |
| `BACKUP_SCHEDULE` | Cron schedule for backups | No (default: daily 2AM) |

## API Documentation

GraphQL Playground is available at `/graphql` when running in development mode.

API documentation is generated from the GraphQL schema and available in `docs/api/`.

## Architecture

The project follows a hybrid Clean Architecture approach:

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                         │
│  GraphQL Resolvers, Middleware (auth, validation, rate limit)   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│  Services (AuthService, MemberService, RelationshipService...)  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DOMAIN LAYER                             │
│  Entities, Value Objects, Repository Interfaces, Domain Errors  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                         │
│  MongoDB Repositories, MinIO Service, External Services         │
└─────────────────────────────────────────────────────────────────┘
```

## Contributing

1. Create a feature branch
2. Write tests first (TDD)
3. Implement the feature
4. Ensure all tests pass
5. Submit a pull request

## License

[License to be determined]

## Support

For issues and feature requests, please use the GitHub issue tracker.
