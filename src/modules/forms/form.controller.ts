import { Request, Response } from 'express';
import { FormService } from './form.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class FormController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const field = await FormService.create(req.body);
    sendSuccess(res, 201, 'Form field created', field);
  });

  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const fields = await FormService.getAll();
    sendSuccess(res, 200, 'Form fields fetched', fields);
  });

  static getActiveForm = asyncHandler(async (_req: Request, res: Response) => {
    const fields = await FormService.getActiveForm();
    sendSuccess(res, 200, 'Active form fetched', fields);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const field = await FormService.getById(req.params.id);
    sendSuccess(res, 200, 'Form field fetched', field);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const field = await FormService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Form field updated', field);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await FormService.delete(req.params.id);
    sendSuccess(res, 200, 'Form field deleted');
  });

  static reorder = asyncHandler(async (req: Request, res: Response) => {
    await FormService.reorder(req.body.fields);
    sendSuccess(res, 200, 'Form fields reordered');
  });
}
