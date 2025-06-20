import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ImportController],
  providers: [ImportService, PrismaService],
  exports: [ImportModule]
})
export class ImportModule {}
