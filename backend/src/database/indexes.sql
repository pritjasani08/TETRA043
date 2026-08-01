-- ==========================================
-- AgriShield AI - PostgreSQL Indexes
-- ==========================================

-- 1. Users Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 1.1 User Settings Indexes
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- 1.2 Device Tokens Indexes
CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON device_tokens(user_id);

-- 1.3 Notifications Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

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
