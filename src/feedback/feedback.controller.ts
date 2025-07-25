import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Users } from "src/common/decorators/users.decorator";
import { User } from "@prisma/client";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { FindFeedbackDto } from "./dto/find-feedback.dto";
import { getPageable, getSort } from "src/common/functions";

@ApiTags("Feedbacks")
@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "itemsPerPage", required: false })
  @ApiQuery({ name: "sortBy", required: false })
  @ApiQuery({ name: "sortDesc", required: false })
  @ApiQuery({ name: "orderId", required: false })
  async findAll(
    @Users() userRequest: User,
    @Query("status") status?: string,
    @Query("page") page?: number,
    @Query("itemsPerPage") itemsPerPage?: number,
    @Query("sortBy") sortBy?: string,
    @Query("sortDesc") sortDesc?: boolean,
    @Query("orderId") orderId?: string
  ) {
    const params: FindFeedbackDto = {
      status: status || "",
      pageable: getPageable(Number(page), Number(itemsPerPage)),
      sort: getSort(sortBy, sortDesc),
      customerId: userRequest.isSuperAdmin ? undefined : userRequest.id,
      orderId: orderId || "",
    };
    const data = await this.feedbackService.findAll(params);
    const total = await this.feedbackService.count(params);
    return { data: { count: total, list: data } };
  }

  @Post()
  @ApiBearerAuth()
  async create(@Users() userRequest, @Body() data: CreateFeedbackDto) {
    return await this.feedbackService.create(userRequest, data);
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOrderDetail(@Param("id") id: number, @Users() userRequest: User) {
    return await this.feedbackService.findOne(Number(id), userRequest);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(":id")
  async update(
    @Users() requestUser,
    @Param("id") id: number,
    @Body() data: UpdateFeedbackDto
  ) {
    return this.feedbackService.update(requestUser, Number(id), data);
  }
}
