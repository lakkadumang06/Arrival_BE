import mongoose, { Document, Schema } from 'mongoose';
import { FormFieldType, FormFieldOption } from '../../shared/types';

export interface IFormField extends Document {
  label: string;
  name: string;
  type: FormFieldType;
  placeholder: string;
  defaultValue: string;
  required: boolean;
  enabled: boolean;
  order: number;
  options: FormFieldOption[];
  validation: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const formFieldSchema = new Schema<IFormField>(
  {
    label: { type: String, required: true, trim: true },
    name: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: Object.values(FormFieldType),
      required: true,
    },
    placeholder: { type: String, default: '' },
    defaultValue: { type: String, default: '' },
    required: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    options: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    validation: {
      min: { type: Number },
      max: { type: Number },
      pattern: { type: String },
    },
  },
  { timestamps: true }
);

formFieldSchema.index({ order: 1 });

export const FormField = mongoose.model<IFormField>('FormField', formFieldSchema);
