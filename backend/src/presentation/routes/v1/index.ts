import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { customersRoutes } from './customers.routes';
import { appointmentsRoutes } from './appointments.routes';
import { workOrdersRoutes } from './work-orders.routes';
import { servicesRoutes } from './services.routes';
import { stationsRoutes } from './stations.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AutoDetail Pro API v1',
    modules: ['auth', 'customers', 'appointments', 'work-orders', 'services', 'stations'],
  });
});

// Mount all routes
router.use('/auth', authRoutes);
router.use('/customers', customersRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/work-orders', workOrdersRoutes);
router.use('/services', servicesRoutes);
router.use('/stations', stationsRoutes);

export { router as v1Routes };
