import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { QueryDeveloperDto } from './dto/query-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';

@Injectable()
export class DevelopersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDeveloperDto) {
    return this.prisma.developer.create({ data: dto });
  }

  async findAll(query: QueryDeveloperDto) {
    const { page, limit, skill, maxRate } = query;

    const where: any = {};

    if (skill) {
      where.skills = { has: skill };
    }

    if (maxRate) {
      where.rate = { lte: maxRate };
    }

    const [data, total] = await Promise.all([
      this.prisma.developer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.developer.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.developer.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateDeveloperDto) {
    return this.prisma.developer.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.developer.delete({
      where: { id },
    });
  }
}
