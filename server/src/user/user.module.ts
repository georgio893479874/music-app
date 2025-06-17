import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { PerformerModule } from 'src/performer/performer.module';

@Module({
  controllers: [UserController],
  providers: [UserService], 
  imports: [PrismaModule, PerformerModule],
  exports: [UserService],
})
export class UserModule {}