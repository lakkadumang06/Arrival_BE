import { Request, Response } from 'express';
import { FAQService } from './faq.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class FAQController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const faq = await FAQService.create(req.body);
    sendSuccess(res, 201, 'FAQ created', faq);
  });

  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const faqs = await FAQService.getAll();
    sendSuccess(res, 200, 'FAQs fetched', faqs);
  });

  static getEnabled = asyncHandler(async (_req: Request, res: Response) => {
    const faqs = await FAQService.getEnabled();
    sendSuccess(res, 200, 'FAQs fetched', faqs);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const faq = await FAQService.getById(req.params.id);
    sendSuccess(res, 200, 'FAQ fetched', faq);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const faq = await FAQService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'FAQ updated', faq);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await FAQService.delete(req.params.id);
    sendSuccess(res, 200, 'FAQ deleted');
  });
}
