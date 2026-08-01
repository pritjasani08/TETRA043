-- ==========================================
-- AgriShield AI - PostgreSQL Indexes
-- ==========================================

-- 1. Users Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 1.1 User Settings Indexes
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- 2. Detections Indexes
-- Index for temporal queries (Daily/Weekly/Monthly Trends)
CREATE INDEX IF NOT EXISTS idx_detections_created_at ON detections(created_at);
-- Index for distribution grouping by animal type
CREATE INDEX IF NOT EXISTS idx_detections_animal_type ON detections(animal_type);
-- Index for risk level filtering
CREATE INDEX IF NOT EXISTS idx_detections_risk_level ON detections(risk_level);
-- Index for confidence filtering
CREATE INDEX IF NOT EXISTS idx_detections_confidence ON detections(confidence);

-- 3. Alerts Indexes
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
