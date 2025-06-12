import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(file.buffer);
    });
  }
}
