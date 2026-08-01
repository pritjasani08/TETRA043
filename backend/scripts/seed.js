const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSeed() {
  console.log('Connecting to database...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const seedPath = path.join(__dirname, '../src/database/seed.sql');
    console.log('Reading seed file:', seedPath);
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Executing seed...');
    await pool.query(seedSql);
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await pool.end();
  }
}

runSeed();
