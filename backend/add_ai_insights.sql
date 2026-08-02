-- Run this query in your Supabase SQL Editor to upgrade your Detections table and add AI Insights!

-- 1. Modify the detections table to support dynamic frontend features
ALTER TABLE detections ADD COLUMN IF NOT EXISTS ai_insight TEXT;
ALTER TABLE detections ADD COLUMN IF NOT EXISTS side VARCHAR(100);
ALTER TABLE detections ADD COLUMN IF NOT EXISTS actions JSONB;

-- 2. Create the AI Insights library table
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_name VARCHAR(255) NOT NULL,
    insight_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Populate the AI Insights table with varied dynamic intelligence sentences
INSERT INTO ai_insights (animal_name, insight_text) VALUES 
-- Wild Boar Insights
('Wild Boar', 'The animal was detected exhibiting rooting behavior near the boundary line. Recommended to check soil integrity in the area.'),
('Wild Boar', 'Movement patterns suggest a foraging group nearby. Ensure lower fence perimeter is fully secured.'),
('Wild Boar', 'Thermal signature indicates high stress or aggressive movement. Do not approach without proper equipment.'),
('Wild Boar', 'The subject was attempting to dig under the fence barrier. Early deterrents successfully deployed.'),
('Wild Boar', 'Single adult boar detected scouting the perimeter. High probability of the herd following shortly.'),

-- Monkey Insights
('Monkey', 'A troop was spotted utilizing overhanging tree branches to bypass ground sensors. Recommend trimming nearby foliage.'),
('Monkey', 'Erratic movement detected on upper boundaries. Subject appears to be scouting for ripe crops.'),
('Monkey', 'Detected grasping behavior on the fence mesh. Sonic deterrents have been primed in this sector.'),
('Monkey', 'Multiple small signatures moving rapidly across the perimeter. Likely searching for access points.'),
('Monkey', 'Subject observed throwing debris at the sensor array. System remains fully operational.'),

-- Nilgai Insights
('Nilgai', 'Large herbivore detected approaching at a steady pace. Warning lights activated to prevent stampede behavior.'),
('Nilgai', 'Significant mass detected near the main gate. Ensure the structural integrity of the gate hinges.'),
('Nilgai', 'Subject grazing near the outer boundary. Continuous monitoring initiated to ensure it does not cross over.'),
('Nilgai', 'Detected rapid movement parallel to the fence line. Subject appears spooked by environmental factors.'),
('Nilgai', 'A lone adult male spotted testing the boundary line. Strobe deterrents are highly recommended.'),

-- Leopard Insights
('Leopard', 'High-threat predator detected utilizing stealth movement patterns. Perimeter lockdown strongly advised.'),
('Leopard', 'Low thermal profile moving along the brushline. Keep all livestock secured in reinforced enclosures.'),
('Leopard', 'Subject observed stalking near the southern edge. Avoid the area and rely on automated deterrents.'),
('Leopard', 'Predator detected scaling the boundary structure. Immediate high-frequency siren deployment recommended.'),
('Leopard', 'Subject lingering in blind spots. AI tracking has predicted its current trajectory toward the central farm.');
