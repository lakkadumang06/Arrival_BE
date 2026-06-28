import mongoose, { Document, Schema } from 'mongoose';
import { InquiryStatus } from '../../shared/types';

export interface IMessageTemplate extends Document {
  name: string;
  body: string;
  /** Status transition that fires this template. Defaults to `completed`. */
  trigger: InquiryStatus;
  /** Delivery channel — informational; actual sending is pluggable. */
  channel: 'whatsapp' | 'sms' | 'email';
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageTemplateSchema = new Schema<IMessageTemplate>(
  {
    name: { type: String, required: true, trim: true },
    // Supports {{placeholders}} e.g. {{name}}, {{goalCountry}}, {{targetIntake}}.
    body: { type: String, required: true },
    trigger: {
      type: String,
      enum: Object.values(InquiryStatus),
      default: InquiryStatus.COMPLETED,
    },
    channel: {
      type: String,
      enum: ['whatsapp', 'sms', 'email'],
      default: 'whatsapp',
    },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MessageTemplate = mongoose.model<IMessageTemplate>(
  'MessageTemplate',
  messageTemplateSchema
);
