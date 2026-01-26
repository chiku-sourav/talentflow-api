import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  public constructor(private prismaService: PrismaService) {}

  public findAll() {
    return this.prismaService.user.findMany();
  }
}
