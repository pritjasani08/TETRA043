-- Add extra fields to community_posts for richer UI
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS animal VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS distance VARCHAR(50);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS severity VARCHAR(50);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS direction VARCHAR(50);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS eta VARCHAR(50);
