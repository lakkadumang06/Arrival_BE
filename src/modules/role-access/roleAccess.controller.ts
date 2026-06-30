import { Response } from 'express';
import { RoleAccessService } from './roleAccess.service';
import { AuthRequest } from '../../shared/types';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class RoleAccessController {
  static getAll = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const roles = await RoleAccessService.getAll();
    sendSuccess(res, 200, 'Role access fetched', roles);
  });

  static update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = await RoleAccessService.update(req.params.role, req.body.access);
    sendSuccess(res, 200, 'Role access updated', role);
  });
}
