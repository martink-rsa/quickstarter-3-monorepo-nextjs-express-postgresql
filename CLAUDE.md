# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing a Next.js 15 frontend and Express.js backend with Prisma ORM and PostgreSQL. The project uses pnpm workspaces for dependency management and follows a structured MVC architecture for the backend.

## Development Commands

### Root-level commands (run from project root)

- `pnpm install` - Install all dependencies
- `pnpm dev` - Start both web and server in parallel (ports 3030-3031)
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all applications recursively
- `pnpm type-check` - Type check all applications recursively
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Individual app commands

- `pnpm dev:web` - Start Next.js only (port 3030)
- `pnpm dev:server` - Start Express server only (port 3031)
- `pnpm storybook` - Start Storybook server (port 3036)

### Testing commands

- `pnpm test` - Run all tests
- `pnpm test:ui` - Run tests with interactive UI
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:watch` - Run tests in watch mode

### Database commands (Prisma)

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database (development)
- `pnpm db:migrate` - Run Prisma migrations (production)
- `pnpm db:studio` - Open Prisma Studio database GUI

### App-specific commands

Use `pnpm --filter <app>` to run commands in specific apps:

- `pnpm --filter web run <command>`
- `pnpm --filter server run <command>`

## Project Structure

```
apps/
├── web/          # Next.js 15 frontend
│   ├── src/app/  # App Router structure
│   └── .storybook/  # Storybook configuration
└── server/       # Express.js backend
    ├── src/
    │   ├── controllers/  # Request handlers
    │   ├── services/     # Business logic layer
    │   ├── routes/       # Route definitions
    │   └── lib/         # Database connection
    └── prisma/      # Database schema and migrations
```

## Backend Architecture

The Express.js backend follows MVC pattern:

### Layer Structure

- **Controllers** (`src/controllers/`): Handle HTTP requests/responses, input validation
- **Services** (`src/services/`): Business logic, data processing
- **Routes** (`src/routes/`): API endpoint definitions and middleware
- **Models**: Defined via Prisma schema (`prisma/schema.prisma`)

### API Structure

All endpoints use `/api/v1` prefix:

- Health check: `GET /api/v1/health`
- Users CRUD: `/api/v1/users` (full CRUD operations)
- Specials CRUD: `/api/v1/specials` (includes `/active` endpoint)

### Database Integration

- Uses Prisma ORM with PostgreSQL
- Database client initialized in `src/lib/prisma.ts`
- Models: `User` and `Special` with standard CRUD operations
- Connection string configured via `DATABASE_URL` environment variable

## Frontend Architecture

Next.js 15 with App Router:

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest with Storybook integration
- **Development Tools**: Storybook for component development

## Development Ports

The project uses ports 3030-3039 to avoid conflicts:

- Next.js: 3030
- Express API: 3031
- Storybook: 3036

## Environment Setup

Backend requires `.env` file in `apps/server/`:

```
DATABASE_URL="postgresql://..."
PORT=3031
```

## Testing

- **Frontend**: Vitest with Storybook integration and Playwright for browser testing
- **Component Testing**: Stories are automatically tested via Storybook addon
- **Backend**: Comprehensive testing with Vitest and Supertest
  - Unit tests for services with mocked Prisma client
  - Integration tests for controllers with dependency injection
  - 81%+ code coverage with detailed reporting
  - See `apps/server/TEST_SETUP.md` for complete testing documentation

## Key Dependencies

### Frontend (web)

- Next.js 15, React 19, Tailwind CSS v4
- Storybook, Vitest, Playwright

### Backend (server)

- Express.js, Prisma, CORS, dotenv
- TypeScript, tsx for development
- Vitest, Supertest, @faker-js/faker for testing

### Monorepo

- pnpm workspaces, shared Prettier configuration

## Coding Conventions

### Testing

- **Tests must always be colocated with the relevant file**
- Test files should use the `.test.ts` extension
- Place test files in the same directory as the source file they test
- Use descriptive test names and group related tests with `describe` blocks

### Frontend (Web App)

- **React components must always be added to their own folder and use PascalCase naming convention**
  - Example: `src/components/UserProfile/UserProfile.tsx`
- **Test files and Storybook files must be colocated with the component**
  - Example structure:
    ```
    src/components/UserProfile/
    ├── UserProfile.tsx
    ├── UserProfile.test.tsx
    ├── UserProfile.stories.tsx
    └── index.ts
    ```
- **Always use aliases when importing components**
  - Use `@/components/UserProfile` instead of relative paths like `../../../components/UserProfile`
  - Path aliases are configured in `tsconfig.json` and should be leveraged consistently

### Backend (Server)

- Follow MVC architecture with clear separation of concerns
- Use dependency injection for testability
- Keep business logic in services, not controllers
- Controllers should only handle HTTP concerns
