import { Request, Response } from 'express';
import { SettingsService } from './settings.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class SettingsController {
  static get = asyncHandler(async (_req: Request, res: Response) => {
    const settings = await SettingsService.get();
    sendSuccess(res, 200, 'Settings fetched', settings);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const settings = await SettingsService.update(req.body);
    sendSuccess(res, 200, 'Settings updated', settings);
  });
}
