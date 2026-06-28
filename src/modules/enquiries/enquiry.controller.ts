import { Request, Response } from 'express';
import { EnquiryService } from './enquiry.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class EnquiryController {
  // Public — client-facing enquiry form submission
  static create = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, phone, visaType, message } = req.body;
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

    const enquiry = await EnquiryService.create({
      fullName,
      email,
      phone,
      visaType,
      message,
      ipAddress: ipAddress || undefined,
    });

    sendSuccess(res, 201, 'Enquiry submitted successfully', enquiry);
  });

  // Protected — admin list with pagination/search/filter
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, search } = req.query;
    const result = await EnquiryService.getAll({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      status: status as string,
      search: search as string,
    });
    sendSuccess(res, 200, 'Enquiries fetched', result.enquiries, result.meta);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const enquiry = await EnquiryService.getById(req.params.id);
    sendSuccess(res, 200, 'Enquiry fetched', enquiry);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const enquiry = await EnquiryService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Enquiry updated', enquiry);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await EnquiryService.delete(req.params.id);
    sendSuccess(res, 200, 'Enquiry deleted');
  });
}
