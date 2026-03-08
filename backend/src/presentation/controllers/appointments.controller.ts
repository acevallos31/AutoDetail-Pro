import { Request, Response } from 'express';

export class AppointmentsController {
  async list(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Appointments list endpoint ready. Query/service integration pending in Phase 4.',
      data: [],
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    res.status(201).json({
      success: true,
      message: 'Appointment contract validated. Transactional flow integration pending in Phase 4.',
      data: req.body,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Appointment detail endpoint ready. Query integration pending in Phase 4.',
      data: {
        id: Number(req.params.id),
      },
    });
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Appointment status contract validated. State machine integration pending in Phase 4.',
      data: {
        id: Number(req.params.id),
        ...req.body,
      },
    });
  }
}
