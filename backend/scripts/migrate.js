const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  console.log('Connecting to database...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const phases = ['schema', 'constraints', 'indexes', 'functions', 'triggers', 'seed'];

    for (const phase of phases) {
      const filePath = path.join(__dirname, `../src/database/${phase}.sql`);
      if (fs.existsSync(filePath)) {
        console.log(`Executing ${phase}.sql...`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await pool.query(sql);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
