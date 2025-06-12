import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [CloudinaryModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
