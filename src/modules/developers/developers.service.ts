import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { QueryDeveloperDto } from './dto/query-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';

@Injectable()
export class DevelopersService {
  public constructor(private prismaService: PrismaService) {}

  public async create(dto: CreateDeveloperDto) {
    return this.prismaService.developer.create({ data: dto });
  }

  public async findAll(query: QueryDeveloperDto) {
    const { page, limit, skill, maxRate } = query;

    const where: any = {};

    if (skill) {
      where.skills = { has: skill };
    }

    if (maxRate) {
      where.rate = { lte: maxRate };
    }

    const [data, total] = await Promise.all([
      this.prismaService.developer.findMany({
        where,
        // skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.developer.count(),
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

  public async findOne(id: string) {
    return this.prismaService.developer.findUnique({ where: { id } });
  }

  public async update(id: string, dto: UpdateDeveloperDto) {
    return this.prismaService.developer.update({
      where: { id },
      data: dto,
    });
  }

  public async remove(id: string) {
    return this.prismaService.developer.delete({
      where: { id },
    });
  }
}
