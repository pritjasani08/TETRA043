# AgriShield AI

**AgriShield AI** is an AI-powered crop protection platform using computer vision, edge AI, and intelligent animal intrusion detection.

- **Computer Vision Monitoring**: Camera-based AI spots wild boar, nilgai, monkeys, and stray cattle at the fence line.
- **Intelligent Deterrents**: Fires the appropriate deterrent (e.g., sound/sirens) based on the animal detected.
- **Village Safety Network**: Warns neighboring farms in seconds via a connected network.

## Repository Layout

This is a monorepo with two independent Node.js projects:

```
agrishield-ai/
├── backend/    Express + TypeScript API (PostgreSQL)
├── frontend/   React 19 + TanStack Router/Start UI
└── README.md
```

Each project has its own `package.json` and `package-lock.json`. There is **no root package.json** — run all npm commands inside `backend/` or `frontend/`.

## Prerequisites

- Node.js v20+ (Node 18 LTS may work; v20+ recommended)
- npm (v9+)
- PostgreSQL (for the backend SQL mode). Alternatively, run the backend in `mock` mode with no database.

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set at least:

| Variable            | Description                                        |
| ------------------- | -------------------------------------------------- |
| `DATABASE_URL`      | PostgreSQL connection string (e.g. Supabase/RDS).  |
| `JWT_SECRET`        | Long random string (min 10 characters).            |

All variables are documented in `.env.example`. The `.env` file is gitignored and must never be committed.

**No database? Use mock mode.** Set `DATABASE_PROVIDER=mock` in `.env` to run entirely in-memory. Note: `DATABASE_URL` is still validated by the config, so provide any syntactically valid placeholder string.

### 3. (Optional) Create the database schema and seed data

```bash
# Apply schema -> constraints -> indexes -> functions -> triggers -> seed
npm run migrate

# Re-run seed data only (idempotent upserts)
npm run seed
```

> `migrate` drops and recreates all tables. It is a development utility, not a versioned migration system.

### 4. Run the backend

```bash
# Development (watch mode)
npm run dev

# Production-like
npm start
```

The server runs on `http://localhost:5000` (configurable via `PORT`). Health check:

```bash
curl http://localhost:5000/api/v1/health
```

### 5. Validate / build

```bash
npm run typecheck   # TypeScript validation (zero errors expected)
npm run build       # Compile to dist/
```

### Demo credentials

After running `npm run migrate` (or in mock mode), you can log in with:

```
email:    demo@agrishield.in
password: demo1234
```

### Backend conventions

- All routes are mounted under `/api/v1`.
- Engineering standards live in `backend/BACKEND_RULES.md`.
- Architecture / API / database docs live in `backend/docs/`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on `http://localhost:3000` (see Vite output).

Other scripts: `npm run build`, `npm run preview`, `npm run lint`, `npm run format`.

## Development Workflow

1. Start the backend (`cd backend && npm run dev`).
2. Start the frontend (`cd frontend && npm run dev`).
3. All API requests use `Bearer` tokens from `POST /api/v1/auth/login`.

## Troubleshooting

- **`EADDRINUSE` on port 5000** — change `PORT` in `.env`.
- **Database connection errors** — verify `DATABASE_URL` and that the DB is reachable; or switch to `DATABASE_PROVIDER=mock`.
- **JWT errors** — ensure `JWT_SECRET` is at least 10 characters.
