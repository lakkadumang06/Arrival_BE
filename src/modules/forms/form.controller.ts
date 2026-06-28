import { Request, Response } from 'express';
import { FormService } from './form.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { FormScope } from '../../shared/types';

const parseScope = (raw: unknown): FormScope | undefined => {
  if (raw === FormScope.WEBSITE || raw === FormScope.RECEPTION) return raw;
  return undefined;
};

export class FormController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const field = await FormService.create(req.body);
    sendSuccess(res, 201, 'Form field created', field);
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const fields = await FormService.getAll(parseScope(req.query.scope));
    sendSuccess(res, 200, 'Form fields fetched', fields);
  });

  static getActiveForm = asyncHandler(async (req: Request, res: Response) => {
    const scope = parseScope(req.query.scope) || FormScope.WEBSITE;
    const fields = await FormService.getActiveForm(scope);
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
