import { Router } from 'express';
import { StationsController } from '@presentation/controllers/stations.controller';
import { validateRequest } from '@presentation/middleware/validate.middleware';
import {
  stationIdParamsSchema,
  updateMaintenanceStatusRequestSchema,
} from '@application/dtos/station.dto';

const router = Router();
const stationsController = new StationsController();

// List available stations (optionally filtered by type)
router.get('/available', (req, res) => stationsController.listAvailable(req, res));

// List all stations
router.get('/', (req, res) => stationsController.list(req, res));

// Get station by ID with schedules
router.get(
  '/:id',
  validateRequest({ params: stationIdParamsSchema }),
  (req, res) => stationsController.getById(req, res)
);

// Update station maintenance status
router.patch(
  '/:id/maintenance',
  validateRequest({ params: stationIdParamsSchema, body: updateMaintenanceStatusRequestSchema }),
  (req, res) => stationsController.updateMaintenance(req, res)
);

// Get overall station statistics (no ID needed)
router.get('/statistics', (req, res) => stationsController.getStatistics(req, res));

export { router as stationsRoutes };
