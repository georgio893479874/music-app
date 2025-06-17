import { Module } from '@nestjs/common';
import { PerformerService } from './performer.service';
import { PerformerController } from './performer.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PerformerController],
  providers: [PerformerService],
  imports: [PrismaModule],
  exports: [PerformerService],
})
export class PerformerModule {}
