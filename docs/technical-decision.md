# Technical Decision Document

**Project:** Family Tree V2
**Date:** 2026-03-07

---

## Overview

This document records the technical decisions made for the Family Tree V2 project, including the rationale behind each choice.

---

## Architecture Decisions

### ADR-001: Monolithic with Two Repositories

**Status:** Approved

**Context:**
We need to decide how to structure the frontend and backend code.

**Decision:**
Use two separate repositories (frontend and backend) but deploy as a single monolithic unit.

**Rationale:**
- Clear separation of concerns
- Independent development and testing
- Simpler than microservices for this project scale
- Easier deployment with Docker Compose

**Consequences:**
- Need to maintain two codebases
- Shared types handled via GraphQL Codegen

---

### ADR-002: Hybrid Clean Architecture

**Status:** Approved

**Context:**
We want Clean Architecture with SOLID principles but without excessive boilerplate.

**Decision:**
Use a hybrid approach:
- Keep the four layers (Presentation, Application, Domain, Infrastructure)
- Combine Use Cases into Services (pragmatic)
- Co-locate repository interfaces with implementations

**Rationale:**
- Maintains separation of concerns
- Reduces boilerplate code
- Easier to understand and navigate
- Still achieves SOLID principles

**Consequences:**
- Services are larger but cohesive
- Domain layer remains pure (no external dependencies)

---

### ADR-003: GraphQL API

**Status:** Approved

**Context:**
Family tree data is inherently nested and relational. We need an API that handles this well.

**Decision:**
Use GraphQL instead of REST.

**Rationale:**
- Flexible queries for complex nested data
- Single request for multiple resources
- Self-documenting schema
- Excellent for tree/graph structures
- Strong TypeScript integration via codegen

**Consequences:**
- Learning curve for GraphQL
- Need to handle N+1 queries (dataloader)
- File uploads require multipart handling

---

## Frontend Decisions

### ADR-004: React + Vite

**Status:** Approved

**Context:**
Need a modern, fast frontend framework and build tool.

**Decision:**
Use React 18 with Vite as the build tool.

**Rationale:**
- React ecosystem is mature and well-supported
- Vite provides extremely fast HMR
- Native TypeScript support
- Large community and resources

**Consequences:**
- Standard React patterns apply
- Need to configure for production builds

---

### ADR-005: Jotai for State Management

**Status:** Approved

**Context:**
Need a state management solution that works well with GraphQL and TypeScript.

**Decision:**
Use Jotai for atomic state management.

**Rationale:**
- Minimal boilerplate compared to Redux
- Excellent TypeScript support
- Atomic model works well with derived state
- Easy to test and debug
- Good for calculated relationships

**Consequences:**
- Different mental model from Redux
- Need to structure atoms carefully

---

### ADR-006: Ant Design + Tailwind CSS

**Status:** Approved

**Context:**
Need a UI framework for rapid development with custom styling capability.

**Decision:**
Use Ant Design for components with Tailwind CSS for custom styling.

**Rationale:**
- Ant Design provides comprehensive components
- Tailwind enables rapid custom styling
- Work well together with proper configuration
- Reduces custom component development time

**Consequences:**
- Need to configure Tailwind to not conflict with Ant Design
- Bundle size considerations
- Custom theming requires setup

---

### ADR-007: D3.js + react-flow for Visualization

**Status:** Approved

**Context:**
Need to render family trees in multiple visualization formats.

**Decision:**
Use D3.js for custom visualizations and react-flow for interactive graphs.

**Rationale:**
- D3.js is the standard for data visualization
- react-flow provides good interactive graph foundation
- Both work well with React
- Flexible for custom tree layouts

**Consequences:**
- Steeper learning curve for D3.js
- Need to implement tree layout algorithms

---

## Backend Decisions

### ADR-008: Bun.js Runtime

**Status:** Approved

**Context:**
Need a fast, modern JavaScript runtime for the backend.

**Decision:**
Use Bun.js instead of Node.js.

**Rationale:**
- Significantly faster startup and execution
- Native TypeScript support
- Built-in APIs (fetch, crypto, etc.)
- Built-in test runner
- npm-compatible package manager

**Consequences:**
- Newer ecosystem, potentially fewer resources
- Some npm packages may have compatibility issues

---

### ADR-009: Hono Framework

**Status:** Approved

**Context:**
Need a lightweight web framework that works well with Bun.

**Decision:**
Use Hono as the web framework.

**Rationale:**
- Lightweight and fast
- TypeScript-first design
- Excellent Bun support
- Middleware ecosystem
- Similar API to Express but more modern

**Consequences:**
- Smaller community than Express
- Need to learn Hono patterns

---

### ADR-010: Pothos for GraphQL

**Status:** Approved

**Context:**
Need a type-safe GraphQL schema builder.

**Decision:**
Use Pothos (formerly GiraphQL) for GraphQL schema definition.

**Rationale:**
- Type-safe schema builder
- Excellent TypeScript integration
- Plugin ecosystem (validation, auth, etc.)
- Cleaner than TypeGraphQL
- Works well with Zod

**Consequences:**
- Different from traditional SDL approach
- Need to learn Pothos patterns

---

### ADR-011: MongoDB + Mongoose

**Status:** Approved

**Context:**
Need a database for storing family tree data with flexible schemas.

**Decision:**
Use MongoDB with Mongoose ODM.

**Rationale:**
- Document model fits genealogical data well
- Flexible schema for varying member information
- Good text search capabilities
- Mongoose provides validation and relationships
- Easy to set up and maintain

**Consequences:**
- NoSQL considerations for complex queries
- Need to handle relationships manually
- Aggregation for calculated relationships

---

### ADR-012: MinIO for File Storage

**Status:** Approved

**Context:**
Need storage for photos, documents, and media files.

**Decision:**
Use MinIO as self-hosted S3-compatible object storage.

**Rationale:**
- S3-compatible API
- Self-hosted (no cloud dependencies)
- Runs well in Docker
- Can migrate to S3 later if needed
- Presigned URLs for secure access

**Consequences:**
- Need to manage storage capacity
- Backup strategy needed for files

---

## Security Decisions

### ADR-013: Username/Password Authentication Only

**Status:** Approved

**Context:**
Need to decide on authentication method.

**Decision:**
Use username/password only. No email or social login.

**Rationale:**
- Simpler implementation
- No external dependencies (email service, OAuth providers)
- User requirement
- Family owners manage member accounts

**Consequences:**
- No password recovery via email
- Owners must reset member passwords
- Support needed for locked-out owners

---

### ADR-014: JWT for Session Management

**Status:** Approved

**Context:**
Need a session/authentication token mechanism.

**Decision:**
Use JWT (JSON Web Tokens) with 7-day expiration.

**Rationale:**
- Stateless authentication
- Works well with GraphQL
- Can embed user info in token
- No server-side session storage needed

**Consequences:**
- Cannot revoke tokens before expiration
- Need secure token storage on client
- Consider refresh tokens for longer sessions

---

## Testing Decisions

### ADR-015: TDD with 80% Coverage Target

**Status:** Approved

**Context:**
Need to establish testing practices.

**Decision:**
Use Test-Driven Development with >80% code coverage target.

**Rationale:**
- Ensures code quality
- Catches regressions early
- Documents expected behavior
- Improves code design

**Consequences:**
- Slower initial development
- Need to maintain tests
- CI/CD must run tests

---

### ADR-016: Vitest + Playwright for Testing

**Status:** Approved

**Context:**
Need testing frameworks for frontend.

**Decision:**
Use Vitest for unit/component tests, Playwright for E2E tests.

**Rationale:**
- Vitest is Vite-native and fast
- Playwright is modern and reliable
- Both have excellent TypeScript support
- Jest-compatible API (Vitest)

**Consequences:**
- Two testing frameworks to learn
- Need to configure both

---

## Deployment Decisions

### ADR-017: Docker Compose for Deployment

**Status:** Approved

**Context:**
Need a deployment strategy.

**Decision:**
Use Docker Compose for container orchestration.

**Rationale:**
- Simple to set up and maintain
- Good for single-server deployment
- Easy local development
- Standard in the industry

**Consequences:**
- Limited scaling capabilities
- Single point of failure
- Good enough for MVP

---

### ADR-018: GitHub Actions for CI/CD

**Status:** Approved

**Context:**
Need continuous integration and deployment.

**Decision:**
Use GitHub Actions for CI/CD pipeline.

**Rationale:**
- Integrated with GitHub
- Free for public repositories
- Good ecosystem of actions
- Easy to configure

**Consequences:**
- Tied to GitHub platform
- Need to manage secrets securely

---

## Internationalization Decisions

### ADR-019: English and Vietnamese Support

**Status:** Approved

**Context:**
Need to support multiple languages.

**Decision:**
Support English and Vietnamese using react-i18next. Language preference stored in browser (not user profile).

**Rationale:**
- User requirement
- react-i18next is the standard
- Simple switch button (no per-user setting)
- Keeps data model simpler

**Consequences:**
- Translations needed for all UI text
- Need to maintain translation files

---

## Summary Table

| Decision | Choice | Status |
|----------|--------|--------|
| Architecture | Monolithic (2 repos) | Approved |
| Backend Pattern | Hybrid Clean Architecture | Approved |
| API Style | GraphQL | Approved |
| Frontend Framework | React + Vite | Approved |
| State Management | Jotai | Approved |
| UI Framework | Ant Design + Tailwind | Approved |
| Visualization | D3.js + react-flow | Approved |
| Backend Runtime | Bun.js | Approved |
| Web Framework | Hono | Approved |
| GraphQL Builder | Pothos | Approved |
| Database | MongoDB + Mongoose | Approved |
| File Storage | MinIO | Approved |
| Authentication | Username/password | Approved |
| Session | JWT | Approved |
| Testing Strategy | TDD (>80% coverage) | Approved |
| Frontend Testing | Vitest + Playwright | Approved |
| Deployment | Docker Compose | Approved |
| CI/CD | GitHub Actions | Approved |
| Languages | English, Vietnamese | Approved |
