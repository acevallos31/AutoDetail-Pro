import { z } from 'zod';

export const workOrderIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const operatorIdParamsSchema = z.object({
  operatorId: z.coerce.number().int().positive(),
});

export const assignWorkOrderRequestSchema = z.object({
  workOrderId: z.number().int().positive(),
  operatorId: z.number().int().positive(),
});

export const startServiceRequestSchema = z.object({
  workOrderServiceId: z.number().int().positive(),
  operatorId: z.number().int().positive(),
  stationId: z.number().int().positive().optional(),
});

export const completeServiceRequestSchema = z.object({
  workOrderServiceId: z.number().int().positive(),
  operatorId: z.number().int().positive(),
  observations: z.string().max(1000).optional(),
});

export type AssignWorkOrderRequestDto = z.infer<typeof assignWorkOrderRequestSchema>;
export type StartServiceRequestDto = z.infer<typeof startServiceRequestSchema>;
export type CompleteServiceRequestDto = z.infer<typeof completeServiceRequestSchema>;
