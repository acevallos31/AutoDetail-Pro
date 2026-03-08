import { Request, Response } from 'express';
import authService from '../../application/services/auth.service';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email: string; password: string };

    try {
      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en la autenticación';

      res.status(401).json({
        success: false,
        statusCode: 401,
        error: {
          code: 'AUTH_FAILED',
          message,
        },
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body as { refreshToken: string };

    try {
      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al refrescar token';

      res.status(401).json({
        success: false,
        statusCode: 401,
        error: {
          code: 'REFRESH_FAILED',
          message,
        },
      });
    }
  }
}
