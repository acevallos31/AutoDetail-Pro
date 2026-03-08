import { Router } from 'express';
import { CustomersController } from '@presentation/controllers/customers.controller';
import { validateRequest } from '@presentation/middleware/validate.middleware';
import {
  createCustomerRequestSchema,
  customerIdParamsSchema,
  updateCustomerRequestSchema,
} from '@application/dtos/customer.dto';

const router = Router();
const customersController = new CustomersController();

router.get('/', (req, res) => customersController.list(req, res));
router.post('/', validateRequest({ body: createCustomerRequestSchema }), (req, res) => customersController.create(req, res));
router.get('/:id', validateRequest({ params: customerIdParamsSchema }), (req, res) => customersController.getById(req, res));
router.patch(
  '/:id',
  validateRequest({ params: customerIdParamsSchema, body: updateCustomerRequestSchema }),
  (req, res) => customersController.update(req, res)
);

export { router as customersRoutes };
