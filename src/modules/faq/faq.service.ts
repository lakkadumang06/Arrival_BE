import { FAQ, IFAQ } from './faq.model';
import { AppError } from '../../shared/utils/AppError';

export class FAQService {
  static async create(data: Partial<IFAQ>): Promise<IFAQ> {
    const maxOrder = await FAQ.findOne().sort({ order: -1 });
    const order = maxOrder ? maxOrder.order + 1 : 0;
    return FAQ.create({ ...data, order });
  }

  static async getAll(): Promise<IFAQ[]> {
    return FAQ.find().sort({ order: 1 });
  }

  static async getEnabled(): Promise<IFAQ[]> {
    return FAQ.find({ enabled: true }).sort({ order: 1 });
  }

  static async getById(id: string): Promise<IFAQ> {
    const faq = await FAQ.findById(id);
    if (!faq) throw new AppError('FAQ not found', 404);
    return faq;
  }

  static async update(id: string, data: Partial<IFAQ>): Promise<IFAQ> {
    const faq = await FAQ.findByIdAndUpdate(id, data, { new: true });
    if (!faq) throw new AppError('FAQ not found', 404);
    return faq;
  }

  static async delete(id: string): Promise<void> {
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) throw new AppError('FAQ not found', 404);
  }
}
