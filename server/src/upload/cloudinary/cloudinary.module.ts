import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider],
  exports: ['CLOUDINARY'],
})
export class CloudinaryModule {}
