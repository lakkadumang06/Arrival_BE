import cloudinary from '../../config/cloudinary';
import { AppError } from './AppError';

export interface UploadedImage {
  url: string;
  publicId: string;
}

/**
 * Uploads an in-memory image buffer (from multer memoryStorage) to Cloudinary.
 * Returns the secure URL and the public_id (kept so the asset can be deleted later).
 */
export const uploadImage = (
  file: Express.Multer.File,
  folder = 'success-stories'
): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          return reject(new AppError('Image upload failed', 500));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(file.buffer);
  });
};

/**
 * Best-effort delete of a previously uploaded Cloudinary asset.
 * Never throws — failing to clean up an old image must not fail the request.
 */
export const deleteImage = async (publicId?: string): Promise<void> => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete failed:', err);
  }
};
