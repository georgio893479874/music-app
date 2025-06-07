import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService], 
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule {}