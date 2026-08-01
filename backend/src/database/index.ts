export * from './pool';
export * from './connection';

import { pool } from './pool';
import { logger } from '../core/utils/logger';

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  
  logger.debug(`Executed query in ${duration}ms`, { text });
  
  return res;
};
