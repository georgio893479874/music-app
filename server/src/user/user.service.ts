import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: {
    email: string;
    firstname?: string;
    lastname?: string;
    avatar?: string;
    password?: string | null;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        avatar: data.avatar,
        password: data.password ?? null,
      },
    });
  }

  async updateUser(
    id: string,
    data: {
      firstname?: string;
      lastname?: string;
      email?: string;
      avatar?: string;
      banner?: string;
    },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
