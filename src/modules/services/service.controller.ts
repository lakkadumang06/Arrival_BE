import { Request, Response } from 'express';
import { ServiceService } from './service.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class ServiceController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const service = await ServiceService.create(req.body);
    sendSuccess(res, 201, 'Service created', service);
  });

  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const services = await ServiceService.getAll();
    sendSuccess(res, 200, 'Services fetched', services);
  });

  static getEnabled = asyncHandler(async (_req: Request, res: Response) => {
    const services = await ServiceService.getEnabled();
    sendSuccess(res, 200, 'Services fetched', services);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const service = await ServiceService.getById(req.params.id);
    sendSuccess(res, 200, 'Service fetched', service);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const service = await ServiceService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Service updated', service);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await ServiceService.delete(req.params.id);
    sendSuccess(res, 200, 'Service deleted');
  });
}
