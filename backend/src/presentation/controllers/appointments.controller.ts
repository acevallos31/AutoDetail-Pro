import { Request, Response } from 'express';
import { getDatabase } from '@infrastructure/database/postgresql/connection';
import { AppointmentRepository } from '@infrastructure/repositories';
import { CreateAppointmentDTO } from '@domain/entities';
import { createLogger } from '@shared/utils/logger';

const logger = createLogger('AppointmentsController');

export class AppointmentsController {
  private repo: AppointmentRepository;

  constructor() {
    const db = getDatabase();
    if (!db) throw new Error('Database not initialized');
    this.repo = new AppointmentRepository(db);
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { status, customer_id, date_from, date_to, page = 1, limit = 20 } = req.query;
      
      const filters: any = {
        status: status as string,
        customer_id: customer_id ? parseInt(customer_id as string) : undefined,
        date_from: date_from ? new Date(date_from as string) : undefined,
        date_to: date_to ? new Date(date_to as string) : undefined,
        offset: (parseInt(page as string) - 1) * parseInt(limit as string),
        limit: parseInt(limit as string),
      };

      const appointments = await this.repo.findAll(filters);

      res.status(200).json({
        success: true,
        data: appointments,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
        },
      });
    } catch (error) {
      logger.error('Error listing appointments', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to list appointments' },
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, vehicleId, appointmentDateTime, serviceIds, notes } = req.body;
      
      const dto: CreateAppointmentDTO = {
        customer_id: customerId,
        vehicle_id: vehicleId,
        appointment_datetime: new Date(appointmentDateTime),
        service_ids: serviceIds,
        service_quantities: serviceIds.map(() => 1),
        notes: notes || null,
        created_by: undefined, // TODO: Get from auth context
      };

      const result = await this.repo.createWithServices(dto);

      if (!result.success) {
        const statusCode = result.message.includes('ERR-LOCK') ? 409 : 400;
        res.status(statusCode).json({
          success: false,
          error: { code: result.message.split(':')[0], message: result.message },
        });
        return;
      }

      logger.info('Appointment created', { appointment_id: result.appointment_id });
      res.status(201).json({
        success: true,
        data: {
          appointment_id: result.appointment_id,
          total_amount: result.total_amount,
          estimated_duration: result.estimated_duration,
        },
      });
    } catch (error) {
      logger.error('Error creating appointment', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to create appointment' },
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const appointment = await this.repo.findByIdWithDetails(id);

      if (!appointment) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Appointment not found' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      logger.error('Error getting appointment', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get appointment' },
      });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const success = await this.repo.updateStatus(id, status, undefined);

      if (!success) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Appointment not found' },
        });
        return;
      }

      logger.info('Appointment status updated', { id, status });
      res.status(200).json({
        success: true,
        data: { id, status },
      });
    } catch (error) {
      logger.error('Error updating appointment status', { error });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to update status' },
      });
    }
  }
}
