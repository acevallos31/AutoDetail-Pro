import { Router } from 'express';
import { ServicesController } from '@presentation/controllers/services.controller';
import { validateRequest } from '@presentation/middleware/validate.middleware';
import {
  serviceIdParamsSchema,
  calculateTotalRequestSchema,
  createServiceRequestSchema,
  updateServiceRequestSchema,
} from '@application/dtos/service.dto';

const router = Router();
const servicesController = new ServicesController();

// List all services (with optional category filter)
router.get('/', (req, res) => servicesController.list(req, res));

// Get service by ID
router.get(
  '/:id',
  validateRequest({ params: serviceIdParamsSchema }),
  (req, res) => servicesController.getById(req, res)
);

// Calculate total price for services
router.post(
  '/calculate-total',
  validateRequest({ body: calculateTotalRequestSchema }),
  (req, res) => servicesController.calculateTotal(req, res)
);

// Get service price history
router.get(
  '/:id/price-history',
  validateRequest({ params: serviceIdParamsSchema }),
  (req, res) => servicesController.getPriceHistory(req, res)
);

// Create new service (admin only)
router.post(
  '/',
  validateRequest({ body: createServiceRequestSchema }),
  (req, res) => servicesController.create(req, res)
);

// Update service (admin only)
router.patch(
  '/:id',
  validateRequest({ params: serviceIdParamsSchema, body: updateServiceRequestSchema }),
  (req, res) => servicesController.update(req, res)
);

// Deactivate service (admin only)
router.delete(
  '/:id',
  validateRequest({ params: serviceIdParamsSchema }),
  (req, res) => servicesController.deactivate(req, res)
);

export { router as servicesRoutes };
