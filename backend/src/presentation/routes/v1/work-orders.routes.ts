import { Router } from 'express';
import { WorkOrdersController } from '@presentation/controllers/work-orders.controller';
import { validateRequest } from '@presentation/middleware/validate.middleware';
import {
  workOrderIdParamsSchema,
  operatorIdParamsSchema,
  assignWorkOrderRequestSchema,
  startServiceRequestSchema,
  completeServiceRequestSchema,
} from '@application/dtos/work-order.dto';

const router = Router();
const workOrdersController = new WorkOrdersController();

// Get work order by ID
router.get(
  '/:id',
  validateRequest({ params: workOrderIdParamsSchema }),
  (req, res) => workOrdersController.getById(req, res)
);

// Get work orders by operator
router.get(
  '/operator/:operatorId',
  validateRequest({ params: operatorIdParamsSchema }),
  (req, res) => workOrdersController.listByOperator(req, res)
);

// Assign work order to operator
router.post(
  '/assign',
  validateRequest({ body: assignWorkOrderRequestSchema }),
  (req, res) => workOrdersController.assign(req, res)
);

// Start service execution
router.post(
  '/start-service',
  validateRequest({ body: startServiceRequestSchema }),
  (req, res) => workOrdersController.startService(req, res)
);

// Complete service execution
router.post(
  '/complete-service',
  validateRequest({ body: completeServiceRequestSchema }),
  (req, res) => workOrdersController.completeService(req, res)
);

export { router as workOrdersRoutes };
