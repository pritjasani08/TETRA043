import { pool } from './pool';
import { logger } from '../core/utils/logger';

export const checkConnection = async (): Promise<boolean> => {
  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT 1');
    logger.info('Database connected successfully');
    return true;
  } catch (err) {
    logger.error('Database connection failed', err);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};
