import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Order, User } from "@prisma/client";
import { FindOrderDto } from "./dto/find-order.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderStatus, SuccessType } from "src/common/types";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: FindOrderDto) {
    const { status, pageable, sort, customerId } = params;

    return this.prisma.order.findMany({
      where: {
        status: status ? status : undefined,
        customerId: customerId,
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
      },
      skip: pageable.offset,
      take: pageable.limit,
      orderBy: sort,
    });
  }

  async count(params: FindOrderDto): Promise<number> {
    const { status, customerId } = params;

    return this.prisma.order.count({
      where: {
        status: status ? status : undefined,
        customerId: customerId,
      },
    });
  }

  async countOrdersByStatus(userRequest: User) {
    const isAdmin = userRequest.isSuperAdmin;

    const whereCondition = isAdmin ? {} : { customerId: userRequest.id };

    const orderCounts = await this.prisma.order.groupBy({
      by: ["status"],
      where: whereCondition,
      _count: {
        status: true,
      },
    });

    return orderCounts.map((order) => ({
      status: order.status,
      count: order._count.status,
    }));
  }

  async generateUniqueId(): Promise<{
    id: string;
    success: boolean;
    type: SuccessType;
  }> {
    let uniqueId: string;
    let exists: boolean;

    do {
      uniqueId = this.orderIdGenerator();
      exists = await this.checkOrderIdExists(uniqueId);
    } while (exists);

    return { id: uniqueId, success: true, type: SuccessType.CREATE };
  }

  orderIdGenerator(): string {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 10000).toString();
    return `${timestamp}${randomNum}`;
  }

  async checkOrderIdExists(id: string): Promise<boolean> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    return !!order;
  }

  async create(userRequest: User, data: CreateOrderDto) {
    const orderExists = await this.prisma.order.findUnique({
      where: { id: data.id },
    });

    if (orderExists) {
      throw new ConflictException("Order Id already exists");
    }

    const projectNameExists = await this.prisma.order.findFirst({
      where: {
        projectName: data.projectName,
        customerId: userRequest.id,
      },
    });

    if (projectNameExists) {
      throw new ConflictException("Project Name already exists for this user");
    }

    const order = await this.prisma.order.create({
      data: {
        id: data.id,
        projectName: data.projectName,
        service: data.service,
        subService: data.subService,
        uploadImage: data.uploadImage || null,
        quantity: data.quantity,
        servicePrice: data.servicePrice,
        customerId: userRequest.id,
        status: OrderStatus.AWAITING,
        createdUser: userRequest.id,
        createdTime: new Date(),
        updatedUser: userRequest.id,
        updatedTime: new Date(),

        designStyle: null,
        photoDetail: null,
        additionalService: null,
        additionalServicePrice: null,
        orderTotal: data.orderTotal,
      },
    });

    return { id: order.id, success: true, type: SuccessType.CREATE };
  }

  async findOne(
    orderId: string,
    userRequest: User
  ): Promise<{ data: Order; success: boolean; type: SuccessType }> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, "Order not found");
    }

    if (!userRequest.isSuperAdmin && order.customerId !== userRequest.id) {
      throw new ForbiddenException(
        "You do not have permission to view this order"
      );
    }

    return { data: order, success: true, type: SuccessType.READ };
  }

  async update(orderId: string, userRequest: User, data: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, "Order not exist");
    }

    if (!userRequest.isSuperAdmin && order.customerId !== userRequest.id) {
      throw new ForbiddenException(
        "You do not have permission to update this order"
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        ...data,
        updatedUser: userRequest.id,
        updatedTime: new Date(),
      },
    });

    return { id: updatedOrder.id, success: true, type: SuccessType.UPDATE };
  }

  async delete(
    userRequest: User,
    id: string,
    permanent: boolean
  ): Promise<any> {
    const post = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, "Order not exist");
    }

    if (!userRequest.isSuperAdmin && post.customerId !== userRequest.id) {
      throw new ForbiddenException(
        "You do not have permission to delete this order"
      );
    }

    if (permanent) {
      await this.prisma.order.delete({
        where: { id },
      });
      return {
        id: post.id,
        success: true,
        type: SuccessType.DELETE_PERMANENTLY,
      };
    } else {
      await this.prisma.order.update({
        where: { id },
        data: {
          deleteFlg: 1,
          status: OrderStatus.DRAFT,
          updatedUser: userRequest.id,
          updatedTime: new Date(),
        },
      });
      return { id: post.id, success: true, type: SuccessType.DELETE };
    }
  }
}
