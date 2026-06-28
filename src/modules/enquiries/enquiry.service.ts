import { Enquiry, IEnquiry } from './enquiry.model';
import { AppError } from '../../shared/utils/AppError';

export class EnquiryService {
  static async create(data: Partial<IEnquiry>): Promise<IEnquiry> {
    return Enquiry.create(data);
  }

  static async getAll(query: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const { page = 1, limit = 10, status, search } = query;

    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Enquiry.countDocuments(filter),
    ]);

    return {
      enquiries,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getById(id: string): Promise<IEnquiry> {
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) throw new AppError('Enquiry not found', 404);
    return enquiry;
  }

  static async update(id: string, data: Partial<IEnquiry>): Promise<IEnquiry> {
    const enquiry = await Enquiry.findByIdAndUpdate(id, data, { new: true });
    if (!enquiry) throw new AppError('Enquiry not found', 404);
    return enquiry;
  }

  static async delete(id: string): Promise<void> {
    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) throw new AppError('Enquiry not found', 404);
  }
}
