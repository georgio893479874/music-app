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

   async subscribeToUser(subscriberId: string, subscribedToId: string) {
    return this.prisma.userSubscription.create({
      data: {
        subscriberId,
        subscribedToId,
      },
    });
  }

  async unsubscribeFromUser(subscriberId: string, subscribedToId: string) {
    return this.prisma.userSubscription.delete({
      where: {
        subscriberId_subscribedToId: {
          subscriberId,
          subscribedToId,
        },
      },
    });
  }

  async isSubscribed(subscriberId: string, subscribedToId: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: {
        subscriberId_subscribedToId: {
          subscriberId,
          subscribedToId,
        },
      },
    });
    return !!subscription;
  }

  async getUserSubscriptions(subscriberId: string) {
    return this.prisma.userSubscription.findMany({
      where: { subscriberId },
      include: {
        subscribedTo: true,
      },
    });
  }

  async getUserSubscribers(subscribedToId: string) {
    return this.prisma.userSubscription.findMany({
      where: { subscribedToId },
      include: {
        subscriber: true,
      },
    });
  }
}
