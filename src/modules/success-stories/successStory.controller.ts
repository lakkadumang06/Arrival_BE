import { Request, Response } from 'express';
import { SuccessStoryService } from './successStory.service';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export class SuccessStoryController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const story = await SuccessStoryService.create(req.body);
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

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const story = await SuccessStoryService.getById(req.params.id);
    sendSuccess(res, 200, 'Success story fetched', story);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const story = await SuccessStoryService.update(req.params.id, req.body);
    sendSuccess(res, 200, 'Success story updated', story);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await SuccessStoryService.delete(req.params.id);
    sendSuccess(res, 200, 'Success story deleted');
  });
}
