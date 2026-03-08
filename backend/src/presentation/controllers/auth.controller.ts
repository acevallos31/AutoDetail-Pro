import { Request, Response } from 'express';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { email } = req.body as { email: string };

    res.status(200).json({
      success: true,
      message: 'Login contract validated. Service integration pending in Phase 4.',
      data: {
        user: {
          email,
        },
        accessToken: 'phase-3-placeholder-token',
        refreshToken: 'phase-3-placeholder-refresh-token',
      },
    });
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body as { refreshToken: string };

    res.status(200).json({
      success: true,
      message: 'Refresh contract validated. Service integration pending in Phase 4.',
      data: {
        refreshToken,
        accessToken: 'phase-3-placeholder-new-token',
      },
    });
  }
}
