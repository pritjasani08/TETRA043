-- ==========================================
-- AgriShield AI - PostgreSQL Constraints
-- ==========================================

-- 1. Users Constraints
ALTER TABLE users
ADD CONSTRAINT uq_users_email UNIQUE (email);

-- 1.1 User Settings Constraints
ALTER TABLE user_settings
ADD CONSTRAINT fk_user_settings_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
ADD CONSTRAINT uq_user_settings_user_id UNIQUE (user_id);

-- 2. Detections Constraints
ALTER TABLE detections
ADD CONSTRAINT chk_detections_confidence CHECK (confidence >= 0 AND confidence <= 1);

-- 3. Alerts Constraints
ALTER TABLE alerts
ADD CONSTRAINT fk_alerts_detection_id FOREIGN KEY (detection_id) REFERENCES detections(id) ON DELETE SET NULL;
