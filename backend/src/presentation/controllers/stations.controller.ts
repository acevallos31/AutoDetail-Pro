import { Request, Response } from 'express';
import { getDatabase } from '@infrastructure/database/postgresql/connection';
import { StationRepository } from '@infrastructure/repositories';
import { MaintenanceStatus } from '@domain/entities';
import { createLogger } from '@shared/utils/logger';

const logger = createLogger('StationsController');

export class StationsController {
  private repo: StationRepository;

  constructor() {
    const db = getDatabase();
    if (!db) throw new Error('Database not initialized');
    this.repo = new StationRepository(db);
  }

  async listAvailable(req: Request, res: Response): Promise<void> {
    try {
      const { type, datetime = new Date().toISOString() } = req.query;
      const stations = await this.repo.getAvailableStations(new Date(datetime as string), type as string);

      res.status(200).json({
        success: true,
        data: stations,
      });
    } catch (error) {
      logger.error('Error listing available stations', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to list available stations' },
      });
    }
  }

  async list(_req: Request, res: Response): Promise<void> {
    try {
      const stations = await this.repo.findAll();

      res.status(200).json({
        success: true,
        data: stations,
      });
    } catch (error) {
      logger.error('Error listing stations', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to list stations' },
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const station = await this.repo.findByIdWithSchedules(id);

      if (!station) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Station not found' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: station,
      });
    } catch (error) {
      logger.error('Error getting station', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get station' },
      });
    }
  }

  async updateMaintenance(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { maintenanceStatus, notes } = req.body;
      
      const success = await this.repo.updateMaintenanceStatus(
        id, 
        maintenanceStatus as MaintenanceStatus,
        notes || undefined
      );

      if (!success) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Station not found' },
        });
        return;
      }

      logger.info('Station maintenance status updated', { station_id: id, status: maintenanceStatus });
      res.status(200).json({
        success: true,
        data: { id, maintenanceStatus },
      });
    } catch (error) {
      logger.error('Error updating station maintenance', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to update maintenance status' },
      });
    }
  }

  async getStatistics(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.repo.getStatistics();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Error getting station statistics', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get statistics' },
      });
    }
  }
}
