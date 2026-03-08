import { z } from 'zod';

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(10),
});

export type LoginRequestDto = z.infer<typeof loginRequestSchema>;
export type RefreshTokenRequestDto = z.infer<typeof refreshTokenRequestSchema>;
