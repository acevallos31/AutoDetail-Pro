import { z } from 'zod';

export const customerIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createCustomerRequestSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(30),
  notes: z.string().max(500).optional(),
});

export const updateCustomerRequestSchema = createCustomerRequestSchema.partial();

export type CreateCustomerRequestDto = z.infer<typeof createCustomerRequestSchema>;
export type UpdateCustomerRequestDto = z.infer<typeof updateCustomerRequestSchema>;
