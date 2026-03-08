import { Request, Response } from 'express';

export class CustomersController {
  async list(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Customers list endpoint ready. Repository integration pending in Phase 4.',
      data: [],
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    res.status(201).json({
      success: true,
      message: 'Customer contract validated. Persistence integration pending in Phase 4.',
      data: req.body,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Customer detail endpoint ready. Repository integration pending in Phase 4.',
      data: {
        id: Number(req.params.id),
      },
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Customer update contract validated. Persistence integration pending in Phase 4.',
      data: {
        id: Number(req.params.id),
        ...req.body,
      },
    });
  }
}
