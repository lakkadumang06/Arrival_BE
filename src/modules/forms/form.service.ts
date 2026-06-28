import { FormField, IFormField } from './form.model';
import { AppError } from '../../shared/utils/AppError';
import { FormScope } from '../../shared/types';

export class FormService {
  static async create(data: Partial<IFormField>): Promise<IFormField> {
    const scope = data.scope || FormScope.WEBSITE;
    const maxOrder = await FormField.findOne({ scope }).sort({ order: -1 });
    const order = maxOrder ? maxOrder.order + 1 : 0;

    const field = await FormField.create({ ...data, scope, order });
    return field;
  }

  static async getAll(scope?: FormScope): Promise<IFormField[]> {
    const filter = scope ? { scope } : {};
    return FormField.find(filter).sort({ order: 1 });
  }

  static async getActiveForm(scope: FormScope = FormScope.WEBSITE): Promise<IFormField[]> {
    return FormField.find({ enabled: true, scope }).sort({ order: 1 });
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
    const count = await FormField.countDocuments({ scope: FormScope.WEBSITE });
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
      await FormField.insertMany(
        defaultFields.map((f) => ({ ...f, enabled: true, scope: FormScope.WEBSITE }))
      );
      console.log('✅ Default website form fields seeded');
    }

    await this.seedReceptionFields();
  }

  /** Seeds the QR intake form with the fields the reception desk needs. */
  static async seedReceptionFields(): Promise<void> {
    const count = await FormField.countDocuments({ scope: FormScope.RECEPTION });
    if (count > 0) return;

    const fields = [
      { label: 'Full Name', name: 'name', type: 'text', required: true, placeholder: 'Enter your full name', order: 0 },
      { label: 'Mobile Number', name: 'mobile', type: 'phone', required: true, placeholder: 'Enter your mobile number', order: 1 },
      { label: 'Address', name: 'address', type: 'textarea', required: false, placeholder: 'Enter your address', order: 2 },
      { label: 'Goal Country', name: 'goalCountry', type: 'country_selector', required: true, placeholder: 'Which country?', order: 3 },
      {
        label: 'Target Intake', name: 'targetIntake', type: 'dropdown', required: true, placeholder: 'Select intake', order: 4,
        options: [
          { label: 'Spring 2026', value: 'spring-2026' },
          { label: 'Fall 2026', value: 'fall-2026' },
          { label: 'Spring 2027', value: 'spring-2027' },
          { label: 'Fall 2027', value: 'fall-2027' },
        ],
      },
    ];

    await FormField.insertMany(
      fields.map((f) => ({ ...f, enabled: true, scope: FormScope.RECEPTION }))
    );
    console.log('✅ Default reception (QR) form fields seeded');
  }
}
