import mongoose, { Document, Schema } from 'mongoose';
import { FormFieldType, FormFieldOption, FormScope } from '../../shared/types';

export interface IFormField extends Document {
  label: string;
  name: string;
  type: FormFieldType;
  scope: FormScope;
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
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: Object.values(FormFieldType),
      required: true,
    },
    scope: {
      type: String,
      enum: Object.values(FormScope),
      default: FormScope.WEBSITE,
      index: true,
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

// Field `name` must be unique within a scope, but the same name may exist
// in both the website form and the reception (QR) form.
formFieldSchema.index({ scope: 1, name: 1 }, { unique: true });
formFieldSchema.index({ scope: 1, order: 1 });

export const FormField = mongoose.model<IFormField>('FormField', formFieldSchema);
