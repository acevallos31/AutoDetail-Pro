import { z } from 'zod';

export const appointmentIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createAppointmentRequestSchema = z.object({
  customerId: z.number().int().positive(),
  vehicleId: z.number().int().positive(),
  appointmentDateTime: z.string().datetime(),
  notes: z.string().max(500).optional(),
  serviceIds: z.array(z.number().int().positive()).min(1),
});

export const updateAppointmentStatusRequestSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled']),
  notes: z.string().max(500).optional(),
});

export type CreateAppointmentRequestDto = z.infer<typeof createAppointmentRequestSchema>;
export type UpdateAppointmentStatusRequestDto = z.infer<typeof updateAppointmentStatusRequestSchema>;
