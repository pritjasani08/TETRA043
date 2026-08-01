# Database Scripts

This directory contains the PostgreSQL schema definitions and migration scripts for the AgriShield AI backend.

## Migration Order

The migration script (`backend/scripts/migrate.js`) executes these files in the following strict order to ensure referential integrity and dependency resolution:

1. **`schema.sql`**: Defines the base tables and their Primary Keys.
2. **`constraints.sql`**: Adds constraints like Foreign Keys, Unique constraints, and Checks.
3. **`indexes.sql`**: Creates indexes on heavily queried analytical columns.
4. **`functions.sql`**: Defines any database functions or stored procedures (Reserved for future).
5. **`triggers.sql`**: Attaches triggers to tables for automated operations (Reserved for future).
6. **`seed.sql`**: Inserts initial mock or seed data for development and testing.

## Running Migrations

To apply the schema to your database (as defined by `DATABASE_URL` in `.env`):

```bash
cd backend
node scripts/migrate.js
```
