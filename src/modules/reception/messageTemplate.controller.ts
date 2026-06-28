import { Request, Response } from 'express';
import { MessageTemplateService } from './messageTemplate.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class MessageTemplateController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const tpl = await MessageTemplateService.create(req.body);
    sendSuccess(res, 201, 'Template created', tpl);
  });

  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const tpls = await MessageTemplateService.getAll();
    sendSuccess(res, 200, 'Templates fetched', tpls);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const tpl = await MessageTemplateService.getById(req.params.id);
    sendSuccess(res, 200, 'Template fetched', tpl);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const tpl = await MessageTemplateService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Template updated', tpl);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await MessageTemplateService.delete(req.params.id);
    sendSuccess(res, 200, 'Template deleted');
  });
}
