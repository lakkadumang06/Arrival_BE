import { Request, Response } from 'express';
import { SuccessStoryService } from './successStory.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

// With multipart/form-data, all non-file fields arrive as strings.
// Coerce the few fields that aren't strings on the model.
const normalizeBody = (body: Record<string, any>) => {
  const data = { ...body };
  if (data.enabled !== undefined) data.enabled = data.enabled === 'true' || data.enabled === true;
  if (data.approvalYear !== undefined) data.approvalYear = Number(data.approvalYear);
  if (data.order !== undefined) data.order = Number(data.order);
  return data;
};

export class SuccessStoryController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const story = await SuccessStoryService.create(normalizeBody(req.body), req.file);
    sendSuccess(res, 201, 'Success story created', story);
  });

  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const stories = await SuccessStoryService.getAll();
    sendSuccess(res, 200, 'Success stories fetched', stories);
  });

  static getEnabled = asyncHandler(async (_req: Request, res: Response) => {
    const stories = await SuccessStoryService.getEnabled();
    sendSuccess(res, 200, 'Success stories fetched', stories);
  });

  // Public — latest 7 stories for the homepage
  static getLatest = asyncHandler(async (_req: Request, res: Response) => {
    const stories = await SuccessStoryService.getLatest(7);
    sendSuccess(res, 200, 'Latest success stories fetched', stories);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const story = await SuccessStoryService.getById(req.params.id);
    sendSuccess(res, 200, 'Success story fetched', story);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const story = await SuccessStoryService.update(
      req.params.id,
      normalizeBody(req.body),
      req.file
    );
    sendSuccess(res, 200, 'Success story updated', story);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await SuccessStoryService.delete(req.params.id);
    sendSuccess(res, 200, 'Success story deleted');
  });
}
