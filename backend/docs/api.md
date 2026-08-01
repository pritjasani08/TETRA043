# AgriShield AI Backend API

## Base Path: `/api/v1`
*All endpoints are strictly versioned.*

### Health Check
- `GET /api/v1/health`: Returns server status, database status, uptime, environment, app version, and request ID.

### Dashboard
- `GET /api/v1/dashboard/summary`: Retrieves aggregated dashboard metrics, charts, distribution, and quick actions. **Requires Authentication header (`Bearer <token>`)**.

### Detection
- `POST /api/v1/detections/analyze`: Submits an image for AI processing. Expects `multipart/form-data` with an `image` file. Returns an array of detections, bounding boxes, and system recommendations. **Requires Authentication header**.

### Analytics
- `GET /api/v1/analytics/summary`: Retrieves aggregated analytics data including trends, distribution, and security score. **Requires Authentication header (`Bearer <token>`)**.

### Authentication
- `POST /api/v1/auth/signup`: Create a new user account. Expects `email`, `password`, `firstName`, `lastName`. Returns User and JWT.
- `POST /api/v1/auth/login`: Authenticate an existing user. Expects `email`, `password`. Returns User and JWT.
- `POST /api/v1/auth/logout`: Discards session.
- `GET /api/v1/auth/me`: Retrieves current user profile. **Requires Authentication header (`Bearer <token>`)**.

### Standard Response Format
Every endpoint guarantees this `ApiResponse` format:
```json
{
  "success": true,
  "message": "Action successful",
  "data": {}
}
```

(More endpoints will be documented as feature modules are developed)
