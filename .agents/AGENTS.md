# Commit Rules

- Commit messages should always begin with your TETRA ID (TETRA043), followed by a short, clear description of what was done.

# Implementation & Documentation Rules

- Every implementation must strictly follow the rules defined in `backend/BACKEND_RULES.md`.
- You must always keep the documentation (`docs/architecture.md`, `docs/api.md`, `docs/database.md`) updated and in sync after every phase or significant implementation.

# Database Migration Workflow Rules

- **No ORMs Allowed:** We do not use Prisma, TypeORM, or any similar tools. All database changes must be written as raw, parameterized SQL.
- **File Segregation:** Database changes must strictly go into their designated files in `backend/src/database/`:
  - `schema.sql`: Only for creating tables and defining `PRIMARY KEY`s.
  - `constraints.sql`: For all `FOREIGN KEY`, `UNIQUE`, and `CHECK` constraints.
  - `indexes.sql`: For creating indexes.
  - `functions.sql` & `triggers.sql`: For stored procedures and their triggers.
  - `seed.sql`: For inserting default/initial data.
- **Execution:** To apply migrations, agents MUST run `node scripts/migrate.js` from the `backend/` directory.
- **Documentation:** Any changes to the schema must immediately be reflected in the ER diagram within `backend/docs/database.md`.
