import { Lead, ILead } from './lead.model';
import { LeadStatus } from '../../shared/types';
import { AppError } from '../../shared/utils/AppError';

export class LeadService {
  static async create(data: {
    formData: Record<string, any>;
    ipAddress?: string;
    browser?: string;
  }): Promise<ILead> {
    const lead = await Lead.create({
      formData: data.formData,
      ipAddress: data.ipAddress,
      browser: data.browser,
      status: LeadStatus.NEW,
    });
    return lead;
  }

  static async getAll(query: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { 'formData.name': { $regex: search, $options: 'i' } },
        { 'formData.email': { $regex: search, $options: 'i' } },
        { 'formData.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort(sort).skip(skip).limit(limit),
      Lead.countDocuments(filter),
    ]);

    return {
      leads,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string): Promise<ILead> {
    const lead = await Lead.findById(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return lead;
  }

  static async update(id: string, data: Partial<ILead>): Promise<ILead> {
    const lead = await Lead.findByIdAndUpdate(id, data, { new: true });
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return lead;
  }

  static async delete(id: string): Promise<void> {
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
  }

  static async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, todayLeads, statusCounts] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ createdAt: { $gte: today } }),
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const stats: Record<string, number> = { total, today: todayLeads };
    statusCounts.forEach((item) => {
      stats[item._id] = item.count;
    });

    return stats;
  }

  static async getRecent(limit: number = 5) {
    return Lead.find().sort({ createdAt: -1 }).limit(limit);
  }

  static async exportCSV() {
    const leads = await Lead.find().sort({ createdAt: -1 });
    
    if (leads.length === 0) return '';

    // Get all unique keys from formData
    const allKeys = new Set<string>();
    leads.forEach((lead) => {
      Object.keys(lead.formData || {}).forEach((key) => allKeys.add(key));
    });

    const headers = ['ID', 'Status', 'Notes', ...Array.from(allKeys), 'Created At'];
    const rows = leads.map((lead) => {
      const formValues = Array.from(allKeys).map(
        (key) => `"${(lead.formData?.[key] || '').toString().replace(/"/g, '""')}"`
      );
      return [
        lead._id,
        lead.status,
        `"${(lead.notes || '').replace(/"/g, '""')}"`,
        ...formValues,
        lead.createdAt.toISOString(),
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
}
