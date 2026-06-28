import { Inquiry, IInquiry } from './inquiry.model';
import { InquiryStatus } from '../../shared/types';
import { AppError } from '../../shared/utils/AppError';
import { emitToDashboards, SocketEvent } from '../../socket';
import { MessageTemplateService } from './messageTemplate.service';

const KNOWN_FIELDS = ['name', 'mobile', 'address', 'goalCountry', 'targetIntake', 'joiningDate'];

export class InquiryService {
  /**
   * Public QR-form submission. Maps the known reception fields and stashes any
   * Owner-defined custom fields into `extraData`, then pushes the new student
   * to every connected dashboard in real time.
   */
  static async create(data: {
    formData: Record<string, any>;
    ipAddress?: string;
    browser?: string;
  }): Promise<IInquiry> {
    const { formData } = data;

    const extraData: Record<string, any> = {};
    Object.keys(formData || {}).forEach((key) => {
      if (!KNOWN_FIELDS.includes(key)) extraData[key] = formData[key];
    });

    const inquiry = await Inquiry.create({
      name: formData.name,
      mobile: formData.mobile,
      address: formData.address || '',
      goalCountry: formData.goalCountry || '',
      targetIntake: formData.targetIntake || '',
      joiningDate: formData.joiningDate ? new Date(formData.joiningDate) : undefined,
      extraData,
      ipAddress: data.ipAddress,
      browser: data.browser,
      status: InquiryStatus.WAITING,
    });

    // Real-time notification to reception desk + owner dashboards.
    emitToDashboards(SocketEvent.INQUIRY_NEW, inquiry);

    return inquiry;
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
      limit = 20,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { goalCountry: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter).sort(sort).skip(skip).limit(limit),
      Inquiry.countDocuments(filter),
    ]);

    return {
      inquiries,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /** Live queue: everyone not yet completed, oldest first (FIFO). */
  static async getQueue() {
    return Inquiry.find({
      status: { $in: [InquiryStatus.WAITING, InquiryStatus.IN_CONSULTATION, InquiryStatus.RESCHEDULED] },
    }).sort({ createdAt: 1 });
  }

  static async getById(id: string): Promise<IInquiry> {
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) throw new AppError('Inquiry not found', 404);
    return inquiry;
  }

  static async update(id: string, data: Partial<IInquiry>): Promise<IInquiry> {
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) throw new AppError('Inquiry not found', 404);

    const wasCompleted = inquiry.status === InquiryStatus.COMPLETED;
    Object.assign(inquiry, data);

    // Stamp completion the first time the status flips to completed.
    if (inquiry.status === InquiryStatus.COMPLETED && !wasCompleted) {
      inquiry.completedAt = new Date();
    }

    await inquiry.save();

    emitToDashboards(SocketEvent.INQUIRY_UPDATED, inquiry);

    // Fire the "Thank You" / follow-up template on completion.
    if (inquiry.status === InquiryStatus.COMPLETED && !wasCompleted) {
      await MessageTemplateService.handleStatusCompleted(inquiry).catch((err) =>
        console.error('Template trigger failed:', err)
      );
    }

    return inquiry;
  }

  /** Lightweight status-only update — the Reception desk's main action. */
  static async updateStatus(id: string, status: InquiryStatus): Promise<IInquiry> {
    return this.update(id, { status });
  }

  static async delete(id: string): Promise<void> {
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) throw new AppError('Inquiry not found', 404);
    emitToDashboards(SocketEvent.INQUIRY_DELETED, { _id: id });
  }

  /**
   * Analytics for the Owner dashboard:
   *  - conversion ratio (completed / total)
   *  - status breakdown
   *  - daily walk-ins for the last `days` days
   */
  static async getAnalytics(days = 14) {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (days - 1));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, completed, todayCount, statusAgg, dailyAgg] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: InquiryStatus.COMPLETED }),
      Inquiry.countDocuments({ createdAt: { $gte: today } }),
      Inquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Inquiry.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const statusBreakdown: Record<string, number> = {};
    Object.values(InquiryStatus).forEach((s) => (statusBreakdown[s] = 0));
    statusAgg.forEach((row) => (statusBreakdown[row._id] = row.count));

    // Fill gaps so the chart has a continuous day axis.
    const dailyMap = new Map(dailyAgg.map((d) => [d._id, d.count]));
    const dailyWalkIns: Array<{ date: string; count: number }> = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      dailyWalkIns.push({ date: key, count: dailyMap.get(key) || 0 });
    }

    return {
      total,
      completed,
      today: todayCount,
      conversionRate: total ? Math.round((completed / total) * 100) : 0,
      statusBreakdown,
      dailyWalkIns,
    };
  }
}
