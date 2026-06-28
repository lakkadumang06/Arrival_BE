import { SuccessStory, ISuccessStory } from './successStory.model';
import { AppError } from '../../shared/utils/AppError';
import { uploadImage, deleteImage } from '../../shared/utils/uploadImage';

export class SuccessStoryService {
  static async create(
    data: Partial<ISuccessStory>,
    file?: Express.Multer.File
  ): Promise<ISuccessStory> {
    if (file) {
      const { url, publicId } = await uploadImage(file);
      data.image = url;
      data.imagePublicId = publicId;
    }

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

  // Feature 3: latest 7 enabled stories, newest first — for the homepage.
  // .lean() returns plain objects (skips Mongoose hydration) for faster reads.
  static async getLatest(limit = 7): Promise<ISuccessStory[]> {
    return SuccessStory.find({ enabled: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<ISuccessStory[]>();
  }

  static async getById(id: string): Promise<ISuccessStory> {
    const story = await SuccessStory.findById(id);
    if (!story) throw new AppError('Success story not found', 404);
    return story;
  }

  static async update(
    id: string,
    data: Partial<ISuccessStory>,
    file?: Express.Multer.File
  ): Promise<ISuccessStory> {
    const existing = await SuccessStory.findById(id);
    if (!existing) throw new AppError('Success story not found', 404);

    if (file) {
      const { url, publicId } = await uploadImage(file);
      // Remove the old asset only after the new one uploads successfully.
      await deleteImage(existing.imagePublicId);
      data.image = url;
      data.imagePublicId = publicId;
    }

    const story = await SuccessStory.findByIdAndUpdate(id, data, { new: true });
    if (!story) throw new AppError('Success story not found', 404);
    return story;
  }

  static async delete(id: string): Promise<void> {
    const story = await SuccessStory.findByIdAndDelete(id);
    if (!story) throw new AppError('Success story not found', 404);
    await deleteImage(story.imagePublicId);
  }
}
