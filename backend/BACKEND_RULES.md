# AgriShield AI Backend Constitution

This file outlines the non-negotiable engineering standards and rules for the AgriShield AI Backend. These rules must be strictly adhered to during all phases of development.

## 1. Architectural Boundaries
*   **Controllers never contain business logic.** They only parse requests, validate via Zod middleware, pass data to services, and format responses using `ApiResponse`.
*   **Services contain all business logic.** Services must NEVER access `req` or `res` objects.
*   **No SQL in controllers or services.**
*   **Repositories only access the database.** They contain zero business logic.

## 2. Standardized Module Structure
Every feature module must strictly follow this internal structure, exposing ONLY `index.ts`:
```
module/
    index.ts
    routes.ts
    controller.ts
    service.ts
    repository.ts
    validator.ts
    types.ts
```
*No exceptions. Every new endpoint requires a validator, controller, service, repository, and route.*
*No module may directly import another module's controller.*

## 3. Dependency Injection
*   Services must receive repositories via constructor injection. Avoid `new Repository()` inside services.

## 4. Repository Standards
*   **No Generic Methods**: Expose business-oriented methods (`findUserByEmail()`, `saveDetection()`) rather than SQL-oriented methods (`executeQuery()`).
*   **SQL Constraints**:
    *   ALL SQL queries must use parameterized placeholders.
    *   Never use `SELECT *`. Always explicitly list required columns.
    *   Never concatenate strings for SQL generation.
    *   Use descriptive aliases where needed.

## 5. API and Responses
*   **Versioning**: ALL routes must be mounted under `/api/v1`. Unversioned endpoints are strictly prohibited.
*   **Standard Responses**: EVERY endpoint must return an `ApiResponse`.

## 6. Integrations and Events
*   **AI Integrations**: Must exclusively go through the `AiProvider` interface. The provider (`DummyAiProvider` or `FastApiProvider`) must return exactly the same `DetectionResult` contract. Controllers/Services must never know which implementation is active.
*   **Domain Events**: Interactions across boundaries (e.g., triggering alerts) must use the shared Domain Event system rather than tight coupling.


## 8. Module Completion Checklist
Every new feature module MUST implement the following components. No exceptions:
- **DTOs** (Data Transfer Objects)
- **Validators** (Zod schemas matching DTOs)
- **Repository Interface** (`IRepository`)
- **Mock Repository** (Until SQL schema is finalized)
- **Service** (Business Logic)
- **Controller** (Request/Response Coordinator)
- **Routes** (Express endpoints)
- **Mapper** (Required if exposing database entities to the API)
- **Domain Events** (When applicable for cross-boundary communication)
- **Documentation Update** (Keep `docs/` in sync)
