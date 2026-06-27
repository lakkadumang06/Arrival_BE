import mongoose, { Document, Schema } from 'mongoose';

export interface ISuccessStory extends Document {
  name: string;
  image: string;
  country: string;
  visaType: string;
  description: string;
  exam: string;
  examScore: string;
  approvalYear: number;
  enabled: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const successStorySchema = new Schema<ISuccessStory>(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    country: { type: String, required: true, trim: true },
    visaType: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    exam: { type: String, default: '' },
    examScore: { type: String, default: '' },
    approvalYear: { type: Number, default: new Date().getFullYear() },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

successStorySchema.index({ order: 1 });
successStorySchema.index({ enabled: 1 });

export const SuccessStory = mongoose.model<ISuccessStory>('SuccessStory', successStorySchema);
