import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { getPageable, getSort } from "src/common/functions";
import { OrderService } from "./order.service";
import { FindOrderDto } from "./dto/find-order.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Users } from "src/common/decorators/users.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";
import { User } from "@prisma/client";
import { UpdateOrderDto } from "./dto/update-order.dto";

@ApiTags("Orders")
@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "itemsPerPage", required: false })
  @ApiQuery({ name: "sortBy", required: false })
  @ApiQuery({ name: "sortDesc", required: false })
  async findAll(
    @Users() userRequest: User,
    @Query("status") status?: string,
    @Query("page") page?: number,
    @Query("itemsPerPage") itemsPerPage?: number,
    @Query("sortBy") sortBy?: string,
    @Query("sortDesc") sortDesc?: boolean
  ) {
    const params: FindOrderDto = {
      status: status || "",
      pageable: getPageable(Number(page), Number(itemsPerPage)),
      sort: getSort(sortBy, sortDesc),
      customerId: userRequest.isSuperAdmin ? undefined : userRequest.id,
    };
    const data = await this.orderService.findAll(params);
    const total = await this.orderService.count(params);
    return { data: { count: total, list: data } };
  }

  @Get("count-by-status")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async countByStatus(@Users() userRequest: User) {
    return this.orderService.countOrdersByStatus(userRequest);
  }

  @Get("generate-id")
  async generateUniqueId() {
    return await this.orderService.generateUniqueId();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Users() userRequest, @Body() data: CreateOrderDto) {
    return await this.orderService.create(userRequest, data);
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOrderDetail(@Param("id") id: string, @Users() userRequest: User) {
    return await this.orderService.findOne(id, userRequest);
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param("id") id: string,
    @Users() userRequest: User,
    @Body() data: UpdateOrderDto
  ) {
    return await this.orderService.update(id, userRequest, data);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(
    @Users() userRequest: User,
    @Param("id") id: string,
    @Query("permanent") permanent?: string
  ) {
    const isPermanent = permanent === "true";
    return await this.orderService.delete(userRequest, id, isPermanent);
  }
}
