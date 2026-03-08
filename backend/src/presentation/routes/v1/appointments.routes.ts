import { Router } from 'express';
import { AppointmentsController } from '@presentation/controllers/appointments.controller';
import { validateRequest } from '@presentation/middleware/validate.middleware';
import {
  appointmentIdParamsSchema,
  createAppointmentRequestSchema,
  updateAppointmentStatusRequestSchema,
} from '@application/dtos/appointment.dto';

const router = Router();
const appointmentsController = new AppointmentsController();

router.get('/', (req, res) => appointmentsController.list(req, res));
router.post('/', validateRequest({ body: createAppointmentRequestSchema }), (req, res) => appointmentsController.create(req, res));
router.get('/:id', validateRequest({ params: appointmentIdParamsSchema }), (req, res) => appointmentsController.getById(req, res));
router.patch(
  '/:id/status',
  validateRequest({ params: appointmentIdParamsSchema, body: updateAppointmentStatusRequestSchema }),
  (req, res) => appointmentsController.updateStatus(req, res)
);

export { router as appointmentsRoutes };
