import { Response } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../../shared/types';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class UserController {
  static getAll = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const users = await UserService.getAll();
    sendSuccess(res, 200, 'Users fetched', users);
  });

  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await UserService.create(req.body);
    sendSuccess(res, 201, 'User created', user);
  });

  static updatePermissions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await UserService.updatePermissions(req.params.id, req.body.permissions);
    sendSuccess(res, 200, 'Permissions updated', user);
  });

  static update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await UserService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'User updated', user);
  });

  static delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    await UserService.delete(req.params.id, req.user!.id);
    sendSuccess(res, 200, 'User deleted');
  });
}
