import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import { config } from '../config';

// Initialize Supabase Client
export const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);

// Setup standard pg pool if needed for direct queries
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || '', // Optional if using raw pg
});
