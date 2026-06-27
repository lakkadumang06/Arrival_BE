import { SuccessStory, ISuccessStory } from './successStory.model';
import { AppError } from '../../shared/utils/AppError';

export class SuccessStoryService {
  static async create(data: Partial<ISuccessStory>): Promise<ISuccessStory> {
    const maxOrder = await SuccessStory.findOne().sort({ order: -1 });
    const order = maxOrder ? maxOrder.order + 1 : 0;
    return SuccessStory.create({ ...data, order });
  }

  static async getAll(): Promise<ISuccessStory[]> {
    return SuccessStory.find().sort({ order: -1 });
  }

  static async getEnabled(): Promise<ISuccessStory[]> {
    return SuccessStory.find({ enabled: true }).sort({ order: -1 });
  }

  static async getById(id: string): Promise<ISuccessStory> {
    const story = await SuccessStory.findById(id);
    if (!story) throw new AppError('Success story not found', 404);
    return story;
  }

  static async update(id: string, data: Partial<ISuccessStory>): Promise<ISuccessStory> {
    const story = await SuccessStory.findByIdAndUpdate(id, data, { new: true });
    if (!story) throw new AppError('Success story not found', 404);
    return story;
  }

  static async delete(id: string): Promise<void> {
    const story = await SuccessStory.findByIdAndDelete(id);
    if (!story) throw new AppError('Success story not found', 404);
  }
}
