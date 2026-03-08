import { Request, Response } from 'express';
import { getDatabase } from '@infrastructure/database/postgresql/connection';
import { WorkOrderRepository } from '@infrastructure/repositories';
import { AssignWorkOrderDTO, StartServiceDTO, CompleteServiceDTO } from '@domain/entities';
import { createLogger } from '@shared/utils/logger';

const logger = createLogger('WorkOrdersController');

export class WorkOrdersController {
  private repo: WorkOrderRepository;

  constructor() {
    const db = getDatabase();
    if (!db) throw new Error('Database not initialized');
    this.repo = new WorkOrderRepository(db);
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const workOrder = await this.repo.findByIdWithDetails(id);

      if (!workOrder) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Work order not found' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: workOrder,
      });
    } catch (error) {
      logger.error('Error getting work order', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get work order' },
      });
    }
  }

  async listByOperator(req: Request, res: Response): Promise<void> {
    try {
      const operatorId = parseInt(req.params.operatorId);
      const workOrders = await this.repo.findByOperatorId(operatorId);

      res.status(200).json({
        success: true,
        data: workOrders,
      });
    } catch (error) {
      logger.error('Error listing work orders', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to list work orders' },
      });
    }
  }

  async assign(req: Request, res: Response): Promise<void> {
    try {
      const { workOrderId, operatorId } = req.body;
      
      const dto: AssignWorkOrderDTO = {
        work_order_id: workOrderId,
        operator_id: operatorId,
        assigned_by: undefined, // TODO: Get from auth context
      };

      const result = await this.repo.assignToOperator(dto);

      if (!result.success) {
        const statusCode = result.message.includes('ERR-LOCK') ? 409 : 400;
        res.status(statusCode).json({
          success: false,
          error: { code: result.message.split(':')[0], message: result.message },
        });
        return;
      }

      logger.info('Work order assigned', { work_order_id: workOrderId, operator_id: operatorId });
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error assigning work order', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to assign work order' },
      });
    }
  }

  async startService(req: Request, res: Response): Promise<void> {
    try {
      const { workOrderServiceId, operatorId, stationId } = req.body;
      
      const dto: StartServiceDTO = {
        work_order_service_id: workOrderServiceId,
        operator_id: operatorId,
        station_id: stationId,
      };

      const result = await this.repo.startService(dto);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: { code: result.message.split(':')[0], message: result.message },
        });
        return;
      }

        logger.info('Service started', { work_order_service_id: workOrderServiceId });
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error starting service', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to start service' },
      });
    }
  }

  async completeService(req: Request, res: Response): Promise<void> {
    try {
      const { workOrderServiceId, operatorId, observations } = req.body;
      
      const dto: CompleteServiceDTO = {
        work_order_service_id: workOrderServiceId,
        operator_id: operatorId,
        observations: observations || null,
      };

      const result = await this.repo.completeService(dto);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: { code: result.message.split(':')[0], message: result.message },
        });
        return;
      }

      logger.info('Service completed', { 
        work_order_service_id: workOrderServiceId,
        work_order_completed: result.work_order_completed 
      });
      
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error completing service', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to complete service' },
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
      logger.error('Error getting work order statistics', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get statistics' },
      });
    }
  }
}
