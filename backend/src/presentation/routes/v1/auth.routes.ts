import { Router } from 'express';
import { AuthController } from '@presentation/controllers/auth.controller';
import { validateRequest } from '@presentation/middleware/validate.middleware';
import { loginRequestSchema, refreshTokenRequestSchema } from '@application/dtos/auth.dto';

const router = Router();
const authController = new AuthController();

router.post('/login', validateRequest({ body: loginRequestSchema }), (req, res) => authController.login(req, res));
router.post('/refresh', validateRequest({ body: refreshTokenRequestSchema }), (req, res) => authController.refreshToken(req, res));

export { router as authRoutes };
