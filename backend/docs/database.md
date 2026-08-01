# AgriShield AI Database Architecture

## Connection Management
PostgreSQL connections are managed via a `pg` pool located in `src/database/pool.ts`.

## Transactions
A Shared Transaction Manager (`src/database/transaction.ts`) provides a `runInTransaction` wrapper to handle `BEGIN`, `COMMIT`, and `ROLLBACK` for atomic operations.

## Query Execution
All SQL queries are executed manually using parameterized queries. 

## Strict SQL Standards
- MUST use parameterized placeholders (`$1`, `$2`).
- MUST NOT use `SELECT *`. Explicitly list selected columns.
- MUST NOT concatenate strings for queries.
- MUST use descriptive aliases where needed.

## Constraints
- No ORMs (Prisma, TypeORM, etc.).
- SQL belongs strictly in the Repository layer (`modules/*/repository.ts`).
- Repositories must not contain business logic.

## Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ detections : "monitors (future scope)"
    users ||--o| user_settings : "has one"
    detections ||--o{ alerts : "triggers"

    users {
        UUID id PK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR first_name
        VARCHAR last_name
        VARCHAR role
        VARCHAR phone
        VARCHAR village
        VARCHAR district
        VARCHAR state
        VARCHAR farm_name
        NUMERIC farm_size
        VARCHAR primary_crop
        TEXT profile_image_url
        TIMESTAMP created_at
    }

    user_settings {
        UUID id PK
        UUID user_id FK
        VARCHAR language
        BOOLEAN notification_enabled
        BOOLEAN voice_alert_enabled
        VARCHAR voice_language
        INTEGER alert_volume
        BOOLEAN security_system_enabled
        VARCHAR theme
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    detections {
        UUID id PK
        VARCHAR animal_type
        NUMERIC confidence
        VARCHAR risk_level
        NUMERIC bbox_x
        NUMERIC bbox_y
        NUMERIC bbox_w
        NUMERIC bbox_h
        TEXT image_url
        TIMESTAMP created_at
    }

    alerts {
        UUID id PK
        UUID detection_id FK
        TEXT message
        VARCHAR severity
        TIMESTAMP created_at
    }
```
