import { Request, Response } from 'express';
import { LeadService } from './lead.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class LeadController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const browser = req.headers['user-agent'];

    const lead = await LeadService.create({
      formData: req.body.formData,
      ipAddress: ipAddress || undefined,
      browser: browser || undefined,
    });

    sendSuccess(res, 201, 'Inquiry submitted successfully', lead);
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, search, sortBy, sortOrder } = req.query;

    const result = await LeadService.getAll({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });

    sendSuccess(res, 200, 'Leads fetched', result.leads, result.meta);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const lead = await LeadService.getById(req.params.id);
    sendSuccess(res, 200, 'Lead fetched', lead);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const lead = await LeadService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Lead updated', lead);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await LeadService.delete(req.params.id);
    sendSuccess(res, 200, 'Lead deleted');
  });

  static getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await LeadService.getStats();
    sendSuccess(res, 200, 'Dashboard stats', stats);
  });

  static getRecent = asyncHandler(async (_req: Request, res: Response) => {
    const leads = await LeadService.getRecent();
    sendSuccess(res, 200, 'Recent leads', leads);
  });

  static exportCSV = asyncHandler(async (_req: Request, res: Response) => {
    const csv = await LeadService.exportCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csv);
  });
}
