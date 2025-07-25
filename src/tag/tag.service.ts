import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Tag, User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { SuccessType } from "src/common/types";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { FindTagDto } from "./dto/find-tag.dto";

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindTagDto) {
    const { pageable, sort } = params;

    return this.prisma.tag.findMany({
      skip: pageable.offset,
      take: pageable.limit,
      orderBy: sort,
    });
  }

  async count(params: FindTagDto): Promise<number> {
    return this.prisma.tag.count({});
  }

  async create(data: CreateTagDto) {
    const existingTag = await this.prisma.tag.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug }],
      },
    });

    if (existingTag) {
      throw new ConflictException(
        `A tag with the same ${existingTag.name === data.name ? "name" : "slug"} already exists`
      );
    }

    const tag = await this.prisma.tag.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    return { id: tag.id, success: true, type: SuccessType.CREATE };
  }

  async findOne(
    id: number
  ): Promise<{ data: Tag; success: boolean; type: SuccessType }> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException("Tag does not exist");
    }

    return { data: tag, success: true, type: SuccessType.READ };
  }

  async update(id: number, data: UpdateTagDto) {
    const tag = await this.prisma.tag.findFirst({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException("Tag does not exist");
    }

    const existingTag = await this.prisma.tag.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug }],
        NOT: { id },
      },
    });

    if (existingTag) {
      throw new ConflictException(
        `A tag with the same ${existingTag.name === data.name ? "name" : "slug"} already exists`
      );
    }

    await this.prisma.tag.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    return { id: tag.id, success: true, type: SuccessType.UPDATE };
  }

  async delete(id: number) {
    const tag = await this.prisma.tag.findFirst({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException("Tag does not exist");
    }

    await this.prisma.tag.delete({
      where: { id },
    });

    return { id: tag.id, success: true, type: SuccessType.DELETE };
  }
}
