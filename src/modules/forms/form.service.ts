import { FormField, IFormField } from './form.model';
import { AppError } from '../../shared/utils/AppError';

export class FormService {
  static async create(data: Partial<IFormField>): Promise<IFormField> {
    const maxOrder = await FormField.findOne().sort({ order: -1 });
    const order = maxOrder ? maxOrder.order + 1 : 0;

    const field = await FormField.create({ ...data, order });
    return field;
  }

  static async getAll(): Promise<IFormField[]> {
    return FormField.find().sort({ order: 1 });
  }

  static async getActiveForm(): Promise<IFormField[]> {
    return FormField.find({ enabled: true }).sort({ order: 1 });
  }

  static async getById(id: string): Promise<IFormField> {
    const field = await FormField.findById(id);
    if (!field) {
      throw new AppError('Form field not found', 404);
    }
    return field;
  }

  static async update(id: string, data: Partial<IFormField>): Promise<IFormField> {
    const field = await FormField.findByIdAndUpdate(id, data, { new: true });
    if (!field) {
      throw new AppError('Form field not found', 404);
    }
    return field;
  }

  static async delete(id: string): Promise<void> {
    const field = await FormField.findByIdAndDelete(id);
    if (!field) {
      throw new AppError('Form field not found', 404);
    }
  }

  static async reorder(fields: Array<{ id: string; order: number }>): Promise<void> {
    const bulkOps = fields.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order },
      },
    }));
    await FormField.bulkWrite(bulkOps);
  }

  static async seedDefaultFields(): Promise<void> {
    const count = await FormField.countDocuments();
    if (count === 0) {
      const defaultFields = [
        { label: 'Full Name', name: 'name', type: 'text', required: true, placeholder: 'Enter your full name', order: 0 },
        { label: 'Email Address', name: 'email', type: 'email', required: true, placeholder: 'Enter your email', order: 1 },
        { label: 'Phone Number', name: 'phone', type: 'phone', required: true, placeholder: 'Enter your phone number', order: 2 },
        { label: 'Country', name: 'country', type: 'country_selector', required: true, placeholder: 'Select your country', order: 3 },
        { label: 'Visa Type', name: 'visaType', type: 'visa_type_selector', required: true, placeholder: 'Select visa type', order: 4, options: [
          { label: 'Student Visa', value: 'student' },
          { label: 'Work Visa', value: 'work' },
          { label: 'Tourist Visa', value: 'tourist' },
          { label: 'Business Visa', value: 'business' },
          { label: 'Family Visa', value: 'family' },
          { label: 'Permanent Residency', value: 'pr' },
        ]},
        { label: 'Message', name: 'message', type: 'textarea', required: false, placeholder: 'Tell us about your requirements', order: 5 },
      ];
      await FormField.insertMany(defaultFields.map((f) => ({ ...f, enabled: true })));
      console.log('✅ Default form fields seeded');
    }
  }
}
