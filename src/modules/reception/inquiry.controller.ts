import { Request, Response } from 'express';
import { InquiryService } from './inquiry.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { InquiryStatus } from '../../shared/types';

export class InquiryController {
  // Public — QR form submission from a student's phone.
  static create = asyncHandler(async (req: Request, res: Response) => {
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const browser = req.headers['user-agent'];

    const inquiry = await InquiryService.create({
      formData: req.body.formData,
      ipAddress: ipAddress || undefined,
      browser: browser || undefined,
    });

    sendSuccess(res, 201, 'Welcome! Your details were submitted.', inquiry);
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, search, sortBy, sortOrder } = req.query;
    const result = await InquiryService.getAll({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });
    sendSuccess(res, 200, 'Inquiries fetched', result.inquiries, result.meta);
  });

  static getQueue = asyncHandler(async (_req: Request, res: Response) => {
    const queue = await InquiryService.getQueue();
    sendSuccess(res, 200, 'Live queue fetched', queue);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await InquiryService.getById(req.params.id);
    sendSuccess(res, 200, 'Inquiry fetched', inquiry);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await InquiryService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Inquiry updated', inquiry);
  });

  // Reception desk's primary action — change status only.
  static updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await InquiryService.updateStatus(
      req.params.id,
      req.body.status as InquiryStatus
    );
    sendSuccess(res, 200, 'Status updated', inquiry);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await InquiryService.delete(req.params.id);
    sendSuccess(res, 200, 'Inquiry deleted');
  });

  static getAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 14;
    const analytics = await InquiryService.getAnalytics(days);
    sendSuccess(res, 200, 'Analytics fetched', analytics);
  });
}
