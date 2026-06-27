import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../shared/types';
import { sendSuccess, sendError } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class AuthController {
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await AuthService.login(email, password);

    sendSuccess(res, 200, 'Login successful', {
      user,
      token,
      refreshToken,
    });
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      sendError(res, 400, 'Refresh token is required');
      return;
    }

    const tokens = await AuthService.refreshToken(refreshToken);
    sendSuccess(res, 200, 'Token refreshed', tokens);
  });

  static logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    await AuthService.logout(req.user!.id);
    sendSuccess(res, 200, 'Logged out successfully');
  });

  static getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await AuthService.getProfile(req.user!.id);
    sendSuccess(res, 200, 'Profile fetched', user);
  });
}
