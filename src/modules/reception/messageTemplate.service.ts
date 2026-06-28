import { MessageTemplate, IMessageTemplate } from './messageTemplate.model';
import { IInquiry } from './inquiry.model';
import { InquiryStatus } from '../../shared/types';
import { AppError } from '../../shared/utils/AppError';

export class MessageTemplateService {
  static async create(data: Partial<IMessageTemplate>): Promise<IMessageTemplate> {
    return MessageTemplate.create(data);
  }

  static async getAll(): Promise<IMessageTemplate[]> {
    return MessageTemplate.find().sort({ createdAt: -1 });
  }

  static async getById(id: string): Promise<IMessageTemplate> {
    const tpl = await MessageTemplate.findById(id);
    if (!tpl) throw new AppError('Template not found', 404);
    return tpl;
  }

  static async update(id: string, data: Partial<IMessageTemplate>): Promise<IMessageTemplate> {
    const tpl = await MessageTemplate.findByIdAndUpdate(id, data, { new: true });
    if (!tpl) throw new AppError('Template not found', 404);
    return tpl;
  }

  static async delete(id: string): Promise<void> {
    const tpl = await MessageTemplate.findByIdAndDelete(id);
    if (!tpl) throw new AppError('Template not found', 404);
  }

  /** Replaces {{placeholders}} with the student's data. */
  static render(body: string, inquiry: IInquiry): string {
    const data: Record<string, any> = {
      name: inquiry.name,
      mobile: inquiry.mobile,
      goalCountry: inquiry.goalCountry,
      targetIntake: inquiry.targetIntake,
      ...inquiry.extraData,
    };
    return body.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, key) =>
      data[key] != null ? String(data[key]) : ''
    );
  }

  /**
   * Triggered when an inquiry transitions to `completed`. Renders every enabled
   * "completed" template and dispatches it.
   *
   * Dispatch is intentionally a stub: wire it to your WhatsApp/SMS/email
   * provider (the project already has nodemailer configured in `config.smtp`).
   */
  static async handleStatusCompleted(inquiry: IInquiry): Promise<void> {
    const templates = await MessageTemplate.find({
      enabled: true,
      trigger: InquiryStatus.COMPLETED,
    });

    for (const tpl of templates) {
      const message = this.render(tpl.body, inquiry);
      // TODO: integrate real delivery (WhatsApp Cloud API / Twilio / nodemailer).
      console.log(`📨 [${tpl.channel}] → ${inquiry.mobile}: ${message}`);
    }
  }
}
