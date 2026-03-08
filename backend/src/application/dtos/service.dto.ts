import { z } from 'zod';

export const serviceIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const calculateTotalRequestSchema = z.object({
  serviceIds: z.array(z.number().int().positive()).min(1),
  quantities: z.array(z.number().int().positive()).optional(),
});

export const createServiceRequestSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  categoryId: z.number().int().positive(),
  basePrice: z.number().positive(),
  estimatedDuration: z.number().int().positive(),
  requiresBooth: z.boolean().default(false),
  requiresDrying: z.boolean().default(false),
  canBeParallel: z.boolean().default(false),
});

export const updateServiceRequestSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  categoryId: z.number().int().positive().optional(),
  basePrice: z.number().positive().optional(),
  estimatedDuration: z.number().int().positive().optional(),
  requiresBooth: z.boolean().optional(),
  requiresDrying: z.boolean().optional(),
  canBeParallel: z.boolean().optional(),
});

export type CalculateTotalRequestDto = z.infer<typeof calculateTotalRequestSchema>;
export type CreateServiceRequestDto = z.infer<typeof createServiceRequestSchema>;
export type UpdateServiceRequestDto = z.infer<typeof updateServiceRequestSchema>;
