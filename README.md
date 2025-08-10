# Quickstarter 3: Monorepo with Next.js and Express

A full-stack TypeScript monorepo featuring a Next.js 15 frontend and Express.js backend with Prisma ORM and PostgreSQL database. Built with modern development tools including Storybook, Vitest, and comprehensive linting/formatting setup.

## Development ports

NOTE: This repo uses ports 3030-3039 to avoid collisions with other projects you may have running.

| Service           | Port |
| ----------------- | ---- |
| Next.js (Web app) | 3030 |
| Express (Server)  | 3031 |
| Storybook         | 3036 |

## Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL database (configured in `apps/server/.env`)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Set up the database:

```bash
# Push the schema to your database
pnpm db:push

# Or run migrations (for production)
pnpm db:migrate
```

3. Generate Prisma client:

```bash
pnpm db:generate
```

4. Start development servers:

```bash
# Start both web and server
pnpm dev

# Or start individually
pnpm dev:web    # Next.js on http://localhost:3030
pnpm dev:server # Express on http://localhost:3031
```

## Project Structure

```
├── apps/
│   ├── web/          # Next.js 15 frontend (TypeScript, Tailwind)
│   └── server/       # Express.js backend (TypeScript, Prisma)
├── packages/         # Shared packages (if any)
├── pnpm-workspace.yaml
└── package.json
```

## Available Scripts

### Development

- `pnpm dev` - Start both applications in development mode
- `pnpm dev:web` - Start Next.js frontend only (port 3030)
- `pnpm dev:server` - Start Express backend only (port 3031)
- `pnpm storybook` - Start Storybook development server (port 3036)

### Build & Production

- `pnpm build` - Build all applications for production
- `pnpm start` - Start all applications in production mode

### Testing

- `pnpm test` - Run all tests
- `pnpm test:ui` - Run tests with interactive UI
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:watch` - Run tests in watch mode

### Code Quality

- `pnpm lint` - Lint all applications
- `pnpm type-check` - TypeScript type checking across all apps
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Database (Prisma)

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database (development)
- `pnpm db:migrate` - Run Prisma migrations (production)
- `pnpm db:studio` - Open Prisma Studio GUI

## Environment Variables

Create `apps/server/.env` file and configure:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
PORT=3031
```

> **Note**: Make sure your PostgreSQL database is running and accessible before starting the server.

## API Endpoints

All API endpoints are versioned with `/api/v1` prefix:

### Health

- `GET /api/v1/health` - Health check

### Users (Full CRUD)

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create a new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Specials (Full CRUD)

- `GET /api/v1/specials` - Get all specials
- `GET /api/v1/specials/active` - Get only active specials
- `GET /api/v1/specials/:id` - Get special by ID
- `POST /api/v1/specials` - Create a new special
- `PUT /api/v1/specials/:id` - Update special
- `DELETE /api/v1/specials/:id` - Delete special

## Architecture

### Frontend (`apps/web`)

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Components**: Storybook for development and testing
- **Testing**: Vitest with Playwright for browser testing
- **Language**: TypeScript

#### Testing Setup

The server includes comprehensive testing with:

- **Unit Tests**: Services tested with mocked Prisma client
- **Integration Tests**: Controllers tested with dependency injection
- **Coverage**: 81%+ code coverage with detailed reporting
- **Colocated Tests**: Test files placed next to source files
- **Fast Execution**: Vitest provides rapid test feedback

See `apps/server/TEST_SETUP.md` for detailed testing documentation.

### Backend (`apps/server`)

The backend follows MVC (Model-View-Controller) architecture:

```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── routes/          # API route definitions
├── lib/             # Shared utilities (Prisma client)
└── index.ts         # Express server entry point
```

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful API with `/api/v1` prefix
- **Models**: User and Special with full CRUD operations
- **Testing**: Vitest with Supertest for HTTP testing and comprehensive mocking

## Tech Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| Frontend        | Next.js 15, React 19, Tailwind CSS       |
| Backend         | Express.js, Node.js                      |
| Database        | PostgreSQL, Prisma ORM                   |
| Development     | TypeScript, ESLint, Prettier             |
| Testing         | Vitest, Supertest, Playwright, Storybook |
| Package Manager | pnpm with workspaces                     |

## The Road To Dev

🚀 Learn web development for **free** at [The Road To Dev](https://www.theroadtodev.com/)!
