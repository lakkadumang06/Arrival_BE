import { Request, Response } from 'express';
import { CMSService } from './cms.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class CMSController {
  static getContent = asyncHandler(async (_req: Request, res: Response) => {
    const content = await CMSService.getContent();
    sendSuccess(res, 200, 'CMS content fetched', content);
  });

  static updateContent = asyncHandler(async (req: Request, res: Response) => {
    const content = await CMSService.updateContent(req.body);
    sendSuccess(res, 200, 'CMS content updated', content);
  });

  static uploadImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      sendSuccess(res, 400, 'No file uploaded');
      return;
    }
    const url = await CMSService.uploadImage(req.file);
    sendSuccess(res, 200, 'Image uploaded', { url });
  });
}
