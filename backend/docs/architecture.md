# AgriShield AI Backend Architecture

## Overview
The backend uses a strict Layered Architecture inside feature-based modules:
`Router -> Controller -> Service -> Repository -> PostgreSQL`.

Every module strictly follows:
`index.ts, routes.ts, controller.ts, service.ts, repository.ts, validator.ts, types.ts`

## Layers & Dependency Injection
1. **Controller**: Handles HTTP request parsing, validates via Zod, forwards payloads to Services, and formats responses via `ApiResponse`.
2. **Service**: Contains pure business logic. Receives repositories via Constructor Injection. Never touches `req` or `res`. Extends `BaseService`.
3. **Repository**: Handles SQL query construction and interacts directly with PostgreSQL. Exposes only business-oriented methods (`findUserByEmail()`).

## AI Integration
AI is abstracted via `AiProvider`. Both `DummyAiProvider` and `FastApiProvider` return the exact same `DetectionResult` contract. Controllers/Services must never know which implementation is active.

## Domain Events
A centralized `DomainEvents` emitter handles decoupling cross-module workflows (e.g. `DETECTION_CREATED` triggers `ALERT_TRIGGERED`).
