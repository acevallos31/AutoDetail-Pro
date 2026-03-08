import { Request, Response } from 'express';
import { getDatabase } from '@infrastructure/database/postgresql/connection';
import { ServiceRepository } from '@infrastructure/repositories';
import { CreateServiceDTO, UpdateServiceDTO } from '@domain/entities';
import { createLogger } from '@shared/utils/logger';

const logger = createLogger('ServicesController');

export class ServicesController {
  private repo: ServiceRepository;

  constructor() {
    const db = getDatabase();
    if (!db) throw new Error('Database not initialized');
    this.repo = new ServiceRepository(db);
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { category_id } = req.query;
      
      let services;
      if (category_id) {
        services = await this.repo.findByCategoryId(parseInt(category_id as string));
      } else {
        services = await this.repo.findAllWithCategory();
      }

      res.status(200).json({
        success: true,
        data: services,
      });
    } catch (error) {
      logger.error('Error listing services', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to list services' },
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const service = await this.repo.findById(id);

      if (!service) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Service not found' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      logger.error('Error getting service', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get service' },
      });
    }
  }

  async calculateTotal(req: Request, res: Response): Promise<void> {
    try {
      const { serviceIds, quantities } = req.body;
      
      const result = await this.repo.calculateTotal(serviceIds, quantities);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error calculating total', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to calculate total' },
      });
    }
  }

  async getPriceHistory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      const history = await this.repo.getPriceHistory(id);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      logger.error('Error getting price history', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get price history' },
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateServiceDTO = {
        name: req.body.name,
        description: req.body.description || null,
        category_id: req.body.categoryId,
        base_price: req.body.basePrice,
        estimated_duration_minutes: req.body.estimatedDuration,
        requires_booth: req.body.requiresBooth || false,
        requires_drying: req.body.requiresDrying || false,
        can_be_parallel: req.body.canBeParallel || false,
        created_by: undefined, // TODO: Get from auth context
      };

      const serviceId = await this.repo.create(dto);

      logger.info('Service created', { service_id: serviceId });
      res.status(201).json({
        success: true,
        data: { id: serviceId },
      });
    } catch (error) {
      logger.error('Error creating service', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to create service' },
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdateServiceDTO = {
        name: req.body.name,
        description: req.body.description,
        category_id: req.body.categoryId,
        base_price: req.body.basePrice,
        estimated_duration_minutes: req.body.estimatedDuration,
        requires_booth: req.body.requiresBooth,
        requires_drying: req.body.requiresDrying,
        can_be_parallel: req.body.canBeParallel,
        updated_by: undefined, // TODO: Get from auth context
      };

      const service = await this.repo.update(id, dto);

      if (!service) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Service not found' },
        });
        return;
      }

      logger.info('Service updated', { service_id: id });
      res.status(200).json({
        success: true,
        data: { id },
      });
    } catch (error) {
      logger.error('Error updating service', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to update service' },
      });
    }
  }

  async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.repo.deactivate(id, undefined);

      if (!success) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Service not found' },
        });
        return;
      }

      logger.info('Service deactivated', { service_id: id });
      res.status(200).json({
        success: true,
        data: { id },
      });
    } catch (error) {
      logger.error('Error deactivating service', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to deactivate service' },
      });
    }
  }
}
