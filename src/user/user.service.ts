import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { hashSync } from "bcrypt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { exclude, likeField } from "src/common/functions";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { SuccessType, UserStatus, UserType } from "src/common/types";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ConfigService } from "@nestjs/config";
import { FindUserDto } from "./dto/find-user.dto";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  async findAll(params: FindUserDto) {
    const { search, status, pageable, sort } = params;

    return this.prisma.user.findMany({
      where: {
        deleteFlg: 0,
        name: likeField(search),
        status: Number.isNaN(status) ? undefined : status,
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        isSuperAdmin: true,
        avatar: true,
      },
      skip: pageable.offset,
      take: pageable.limit,
      orderBy: sort,
    });
  }

  async count(params: FindUserDto): Promise<number> {
    const { search, status } = params;
    return this.prisma.user.count({
      where: {
        deleteFlg: 0,
        name: likeField(search),
        status: Number.isNaN(status) ? undefined : status,
      },
    });
  }

  async create(userRequest: User, data: CreateUserDto) {
    const exist = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exist) {
      throw new ConflictException(HttpStatus.BAD_REQUEST, "User already exist");
    }

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: hashSync(data.password, 10),
        companyName: data.companyName,
        companyURL: data.companyURL,
        type: UserType.CUSTOMER,
        status: UserStatus.ACTIVATED,
        verified: 0,
        avatar: data.avatar,
        createdUser: userRequest.id,
        createdTime: new Date(),
        updatedUser: userRequest.id,
        updatedTime: new Date(),
      },
    });

    return { id: user.id, success: true, type: SuccessType.CREATE };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deleteFlg: 0,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        companyName: true,
        companyURL: true,
        isSuperAdmin: true,
      },
    });

    if (!user) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, "User not exist");
    }

    return { data: user };
  }

  async update(userRequest: User, id: number, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, "User not exist");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        avatar: data.avatar,
        name: data.name,
        lastName: data.lastName,
        phone: data.phone,
        companyName: data.companyName,
        companyURL: data.companyURL,
        updatedUser: userRequest.id,
        updatedTime: new Date(),
      },
    });

    return { id: user.id, success: true, type: SuccessType.UPDATE };
  }

  async delete(userRequest: User, id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, "User not exist");
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        deleteFlg: 1,
        updatedUser: userRequest.id,
        updatedTime: new Date(),
      },
    });

    return { id: user.id, success: true, type: SuccessType.DELETE };
  }

  async changePassword(userRequest: User, id: number, data: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, "User not exist");
    }

    if (!data.newPassword) {
      throw new BadRequestException("New password must not be empty");
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new BadRequestException("Confirm new password does not match");
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashSync(data.newPassword, 10),
        updatedUser: userRequest.id,
        updatedTime: new Date(),
      },
    });

    return { id: user.id, success: true, type: SuccessType.UPDATE };
  }

  async active(userRequest: User, id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, "User not exist");
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.ACTIVATED,
        updatedUser: userRequest.id,
        updatedTime: new Date(),
      },
    });

    return { id: user.id, success: true, type: SuccessType.UPDATE };
  }

  async deactivate(userRequest: User, id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, "User not exist");
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.DEACTIVATED,
        updatedUser: userRequest.id,
        updatedTime: new Date(),
      },
    });

    return { id: user.id, success: true, type: SuccessType.UPDATE };
  }

  async reject(userRequest: User, id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, "User not exist");
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.REJECTED,
        updatedUser: userRequest.id,
        updatedTime: new Date(),
      },
    });

    return { id: user.id, success: true, type: SuccessType.UPDATE };
  }

  async emailExists(email: string, id?: number) {
    const exists = await this.prisma.user.count({
      where: {
        email,
        id: {
          not: id ? Number(id) : undefined,
        },
      },
    });
    return { success: exists === 0 };
  }
}
