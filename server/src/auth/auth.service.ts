import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(createAuthDto: CreateAuthDto) {
    const { email, password, firstname, lastname } = createAuthDto;

    const errors = await validate(createAuthDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid registration data');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          id: uuidv4(),
          email,
          password: hashedPassword,
          firstname,
          lastname,
        },
      });

      return this.generateToken(user);
    } 
    
    catch (error) {
      throw new Error('Error occurred while creating the user');
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { email: user.email, id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token };
  }
}
