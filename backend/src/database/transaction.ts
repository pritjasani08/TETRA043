import { PoolClient } from 'pg';
import { pool } from './pool';
import { logger } from '../core/utils/logger';

export const runInTransaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Transaction failed and rolled back', error);
    throw error;
  } finally {
    client.release();
  }
};
