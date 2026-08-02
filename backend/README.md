# Backend API

Completely rebuilt backend using Express, Node.js, Supabase PostgreSQL, and Socket.io.

## Installation

1. `npm install`
2. Create `.env` based on `.env.example`
3. Run the SQL migrations from `sql/supabase.sql` in your Supabase SQL Editor.
4. `npm run dev`

## Features

- JWT Authentication
- Supabase PostgreSQL with raw SQL setup
- Socket.io for Hardware Alerts
- Multer for file uploads
- FastAPI Integration forwarding
