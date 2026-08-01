import { z } from 'zod';

// We do not parse req.body heavily here because the primary payload is a file processed by Multer.
// If future metadata is sent alongside the file, it will be validated here.
export const analyzeSchema = z.object({
  body: z.object({}).optional(),
});
