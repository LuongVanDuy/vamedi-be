import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { likeField } from "src/common/functions";
import { ConfigService } from "@nestjs/config";
import { FindPostDto } from "./dto/find-post.dto";
import { CreatePostDto } from "./dto/create-post.dto";
import { SuccessType } from "src/common/types";
import { User } from "@prisma/client";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: FindPostDto) {
    const { search, status, pageable, sort, tag, contentLength } = params;

    const posts = await this.prisma.post.findMany({
      where: {
        deleteFlg: 0,
        title: likeField(search),
        user: {
          status: Number.isNaN(status) ? undefined : status,
        },
        tags: tag
          ? {
              some: {
                slug: { contains: tag },
              },
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        tags: true,
      },
      skip: pageable.offset,
      take: pageable.limit,
      orderBy: sort,
    });

    return posts.map((post) => ({
      ...post,
      content: contentLength
        ? post.content.slice(0, contentLength)
        : post.content,
    }));
  }

  async count(params: FindPostDto): Promise<number> {
    const { search, status, tag } = params;

    return this.prisma.post.count({
      where: {
        deleteFlg: 0,
        title: likeField(search),
        user: {
          status: Number.isNaN(status) ? undefined : status,
        },
        tags: tag
          ? {
              some: {
                slug: { contains: tag },
              },
            }
          : undefined,
      },
    });
  }

  async create(userRequest: User, data: CreatePostDto) {
    const { title, shortDesc, content, thumbnail, slug, tags } = data;

    const isSlugUnique = await this.slugExists(slug);
    if (!isSlugUnique.success) {
      throw new BadRequestException(
        "Slug already exists. Please choose another one."
      );
    }

    if (tags?.length) {
      const existingTags = await this.prisma.tag.findMany({
        where: {
          id: { in: tags },
        },
      });

      if (existingTags.length !== tags.length) {
        const existingTagIds = existingTags.map((tag) => tag.id);
        const missingTagIds = tags.filter(
          (tagId) => !existingTagIds.includes(tagId)
        );

        throw new BadRequestException(
          `Tags with ids [${missingTagIds.join(", ")}] do not exist.`
        );
      }
    }

    const post = await this.prisma.post.create({
      data: {
        title,
        slug,
        shortDesc,
        content,
        thumbnail,
        authorId: userRequest.id,
        tags: tags?.length
          ? { connect: tags.map((id) => ({ id })) }
          : undefined,
        createdUser: userRequest.id,
        updatedUser: userRequest.id,
      },
    });

    return { id: post.id, success: true, type: SuccessType.CREATE };
  }

  async findOneBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return { data: post, success: true, type: SuccessType.READ };
  }

  async findOneById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return { data: post, success: true, type: SuccessType.READ };
  }

  async update(userRequest: User, id: number, data: UpdatePostDto) {
    const { title, shortDesc, content, thumbnail, slug, tags } = data;

    const { success: slugDoesNotExist } = await this.slugExists(slug, id);
    if (!slugDoesNotExist) {
      throw new BadRequestException(
        "Slug already exists. Please choose another one."
      );
    }

    if (tags?.length) {
      const existingTags = await this.prisma.tag.findMany({
        where: {
          id: { in: tags },
        },
      });

      if (existingTags.length !== tags.length) {
        const existingTagIds = existingTags.map((tag) => tag.id);
        const missingTagIds = tags.filter(
          (tagId) => !existingTagIds.includes(tagId)
        );

        throw new BadRequestException(
          `Tags with ids [${missingTagIds.join(", ")}] do not exist.`
        );
      }
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        slug,
        shortDesc,
        content,
        thumbnail,
        updatedUser: userRequest.id,
        updatedTime: new Date(),
        tags: tags?.length
          ? {
              set: [],
              connect: tags.map((id) => ({ id })),
            }
          : undefined,
      },
    });

    return { id: updatedPost.id, success: true, type: SuccessType.UPDATE };
  }

  async delete(
    userRequest: User,
    id: number,
    permanent: boolean
  ): Promise<any> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, "Post not exist");
    }

    if (permanent) {
      await this.prisma.post.delete({
        where: { id },
      });
      return {
        id: post.id,
        success: true,
        type: SuccessType.DELETE_PERMANENTLY,
      };
    } else {
      await this.prisma.post.update({
        where: { id },
        data: {
          deleteFlg: 1,
          updatedUser: userRequest.id,
          updatedTime: new Date(),
        },
      });
      return { id: post.id, success: true, type: SuccessType.DELETE };
    }
  }

  async slugExists(slug: string, id?: number) {
    const exists = await this.prisma.post.count({
      where: {
        slug,
        id: {
          not: id ? Number(id) : undefined,
        },
      },
    });
    return { success: exists === 0 };
  }
}
