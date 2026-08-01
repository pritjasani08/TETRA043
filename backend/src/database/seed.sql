-- Seed Users
INSERT INTO users (id, email, password_hash, first_name, last_name, role)
VALUES 
('50446c8f-1ab1-4bcf-b4bf-f3558d70c3ba', 'demo@agrishield.in', '$2b$10$04IwDMkRrOe24rF8wU8.yez9FpyT4HzDn4vjpGs6rO.DqfAJSBO9S', 'Demo', 'Farmer', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Seed Detections
INSERT INTO detections (id, animal_type, confidence, risk_level, bbox_x, bbox_y, bbox_w, bbox_h, created_at)
VALUES 
(uuid_generate_v4(), 'BOAR', 0.92, 'HIGH', 10.5, 20.2, 100.0, 150.0, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(uuid_generate_v4(), 'DEER', 0.85, 'MEDIUM', 50.5, 40.2, 80.0, 120.0, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
(uuid_generate_v4(), 'ELEPHANT', 0.99, 'CRITICAL', 110.5, 220.2, 300.0, 350.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(uuid_generate_v4(), 'BOAR', 0.78, 'MEDIUM', 15.5, 25.2, 90.0, 140.0, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(uuid_generate_v4(), 'MONKEY', 0.65, 'LOW', 210.5, 120.2, 40.0, 50.0, CURRENT_TIMESTAMP - INTERVAL '3 days');

-- Seed Alerts
INSERT INTO alerts (id, message, severity, created_at)
VALUES 
(uuid_generate_v4(), 'High risk detection: BOAR detected with 92% confidence', 'Critical', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(uuid_generate_v4(), 'Critical risk detection: ELEPHANT detected with 99% confidence', 'Critical', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(uuid_generate_v4(), 'System Maintenance Completed', 'Info', CURRENT_TIMESTAMP - INTERVAL '3 days');
