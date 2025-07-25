import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Feedback, User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackStatus, SuccessType } from "src/common/types";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { FindFeedbackDto } from "./dto/find-feedback.dto";

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindFeedbackDto) {
    const { status, pageable, sort, customerId, orderId } = params;

    return this.prisma.feedback.findMany({
      where: {
        orderId: orderId ? orderId : undefined,
        status: status ? status : undefined,
        createdUser: customerId,
        deleteFlg: 0,
      },
      skip: pageable.offset,
      take: pageable.limit,
      orderBy: sort,
    });
  }

  async count(params: FindFeedbackDto): Promise<number> {
    const { status, customerId, orderId } = params;

    return this.prisma.feedback.count({
      where: {
        orderId: orderId ? orderId : undefined,
        status: status ? status : undefined,
        createdUser: customerId,
        deleteFlg: 0,
      },
    });
  }

  async create(userRequest: User, data: CreateFeedbackDto) {
    const orderExists = await this.prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!orderExists) {
      throw new NotFoundException("Order not found");
    }

    if (
      !userRequest.isSuperAdmin &&
      orderExists.customerId !== userRequest.id
    ) {
      throw new ForbiddenException(
        "You do not have permission to view this order"
      );
    }

    const feedback = await this.prisma.feedback.create({
      data: {
        content: data.content,
        status: FeedbackStatus.PENDING,
        orderId: data.orderId,
        createdUser: userRequest.id,
        createdTime: new Date(),
        updatedUser: userRequest.id,
        updatedTime: new Date(),
      },
    });

    return { id: feedback.id, success: true, type: SuccessType.CREATE };
  }

  async findOne(
    id: number,
    userRequest: User
  ): Promise<{ data: Feedback; success: boolean; type: SuccessType }> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException("feedback not found");
    }

    if (!userRequest.isSuperAdmin && feedback.createdUser !== userRequest.id) {
      throw new ForbiddenException(
        "You do not have permission to view this order"
      );
    }

    return { data: feedback, success: true, type: SuccessType.READ };
  }

  async update(userRequest: User, id: number, data: UpdateFeedbackDto) {
    const orderExists = await this.prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!orderExists) {
      throw new NotFoundException("Order not found");
    }

    if (
      !userRequest.isSuperAdmin &&
      orderExists.customerId !== userRequest.id
    ) {
      throw new ForbiddenException(
        "You do not have permission to view this order"
      );
    }

    const feedback = await this.prisma.feedback.findFirst({
      where: {
        id,
        deleteFlg: 0,
      },
    });

    if (!feedback) {
      throw new NotFoundException("feedback not exist");
    }

    await this.prisma.feedback.update({
      where: { id },
      data: {
        content: data.content,
        orderId: data.orderId,
        status: data.status || FeedbackStatus.PENDING,
        updatedUser: userRequest.id,
        updatedTime: new Date(),
      },
    });

    return { id: feedback.id, success: true, type: SuccessType.UPDATE };
  }
}
