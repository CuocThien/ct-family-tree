# Family Tree V2 - Frontend

React-based frontend for the Family Tree V2 application.

## Prerequisites

- Node.js v18.19.0 or higher (v20+ recommended for Vitest)
- npm or yarn

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests with Vitest |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:ui` | Run tests with UI |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type check |

## Project Structure

```
src/
├── app/              # App configuration and providers
├── features/         # Feature modules
├── shared/           # Shared components and utilities
├── graphql/          # Apollo Client configuration
├── i18n/             # Internationalization
└── styles/           # Global styles
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router v7
- Apollo Client (GraphQL)
- Jotai (State Management)
- Ant Design (UI Components)
- Tailwind CSS
- Vitest (Testing)
