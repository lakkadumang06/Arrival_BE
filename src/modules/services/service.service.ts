import { Service, IService } from './service.model';
import { AppError } from '../../shared/utils/AppError';

export class ServiceService {
  static async create(data: Partial<IService>): Promise<IService> {
    const maxOrder = await Service.findOne().sort({ order: -1 });
    const order = maxOrder ? maxOrder.order + 1 : 0;
    return Service.create({ ...data, order });
  }

  static async getAll(): Promise<IService[]> {
    return Service.find().sort({ order: 1 });
  }

  static async getEnabled(): Promise<IService[]> {
    return Service.find({ enabled: true }).sort({ order: 1 });
  }

  static async getById(id: string): Promise<IService> {
    const service = await Service.findById(id);
    if (!service) throw new AppError('Service not found', 404);
    return service;
  }

  static async update(id: string, data: Partial<IService>): Promise<IService> {
    const service = await Service.findByIdAndUpdate(id, data, { new: true });
    if (!service) throw new AppError('Service not found', 404);
    return service;
  }

  static async delete(id: string): Promise<void> {
    const service = await Service.findByIdAndDelete(id);
    if (!service) throw new AppError('Service not found', 404);
  }
}
