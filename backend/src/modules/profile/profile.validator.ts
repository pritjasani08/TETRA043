import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(100).optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(100).optional(),
    phone: z.string().max(20).optional().nullable(),
    village: z.string().max(255).optional().nullable(),
    district: z.string().max(255).optional().nullable(),
    state: z.string().max(255).optional().nullable(),
    farmName: z.string().max(255).optional().nullable(),
    farmSize: z.number().min(0, "Farm size cannot be negative").max(99999999.99).optional().nullable(),
    primaryCrop: z.string().max(255).optional().nullable(),
    profileImageUrl: z.string().url("Must be a valid URL").optional().nullable(),
  }).strict() // Ensure no extra fields are passed, especially 'email'
});
