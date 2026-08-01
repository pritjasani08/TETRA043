-- ==========================================
-- AgriShield AI - PostgreSQL Schema
-- ==========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS detections CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ------------------------------------------
-- 1. Users Table
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    phone VARCHAR(20),
    village VARCHAR(255),
    district VARCHAR(255),
    state VARCHAR(255),
    farm_name VARCHAR(255),
    farm_size NUMERIC(10, 2),
    primary_crop VARCHAR(255),
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------
-- 1.1. User Settings Table
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    language VARCHAR(20) DEFAULT 'en',
    notification_enabled BOOLEAN DEFAULT TRUE,
    voice_alert_enabled BOOLEAN DEFAULT TRUE,
    voice_language VARCHAR(20) DEFAULT 'en',
    alert_volume INTEGER DEFAULT 100,
    security_system_enabled BOOLEAN DEFAULT TRUE,
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------
-- 2. Detections Table
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    animal_type VARCHAR(100) NOT NULL,
    confidence NUMERIC(5, 4) NOT NULL, -- e.g., 0.9523
    risk_level VARCHAR(50) NOT NULL,
    bbox_x NUMERIC(10, 4) NOT NULL,
    bbox_y NUMERIC(10, 4) NOT NULL,
    bbox_w NUMERIC(10, 4) NOT NULL,
    bbox_h NUMERIC(10, 4) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------
-- 3. Alerts Table
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    detection_id UUID,
    message TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
