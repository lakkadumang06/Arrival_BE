import { Settings, ISettings } from './settings.model';

export class SettingsService {
  static async get(): Promise<ISettings> {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return settings;
  }

  static async update(data: Partial<ISettings>): Promise<ISettings> {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(data);
    } else {
      Object.assign(settings, data);
      await settings.save();
    }
    return settings;
  }
}
