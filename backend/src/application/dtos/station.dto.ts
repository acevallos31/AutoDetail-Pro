import { z } from 'zod';

export const stationIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateMaintenanceStatusRequestSchema = z.object({
  maintenanceStatus: z.enum(['operational', 'under_maintenance', 'out_of_service']),
  notes: z.string().max(500).optional(),
});

export type UpdateMaintenanceStatusRequestDto = z.infer<typeof updateMaintenanceStatusRequestSchema>;
