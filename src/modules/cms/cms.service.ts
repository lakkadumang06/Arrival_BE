import { CMS, ICMS } from './cms.model';
import cloudinary from '../../config/cloudinary';

export class CMSService {
  static async getContent(): Promise<ICMS> {
    let content = await CMS.findOne();
    if (!content) {
      content = await CMS.create({});
    }
    return content;
  }

  static async updateContent(data: Partial<ICMS>): Promise<ICMS> {
    let content = await CMS.findOne();
    if (!content) {
      content = await CMS.create(data);
    } else {
      Object.assign(content, data);
      await content.save();
    }
    return content;
  }

  static async uploadImage(
    file: Express.Multer.File,
    folder: string = 'immigration-crm'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      );
      uploadStream.end(file.buffer);
    });
  }
}
