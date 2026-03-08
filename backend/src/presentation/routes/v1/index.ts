import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { customersRoutes } from './customers.routes';
import { appointmentsRoutes } from './appointments.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AutoDetail Pro API v1',
    modules: ['auth', 'customers', 'appointments'],
  });
});

router.use('/auth', authRoutes);
router.use('/customers', customersRoutes);
router.use('/appointments', appointmentsRoutes);

export { router as v1Routes };
