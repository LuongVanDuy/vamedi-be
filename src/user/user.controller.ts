import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { getPageable, getSort } from "src/common/functions";
import { UserService } from "./user.service";
import { Users } from "src/common/decorators/users.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Module, Permission } from "src/common/types";
import { FindUserDto } from "./dto/find-user.dto";

@ApiTags("Users")
@Controller("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles({ module: Module.USER, permission: Permission.READ })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "itemsPerPage", required: false })
  @ApiQuery({ name: "sortBy", required: false })
  @ApiQuery({ name: "sortDesc", required: false })
  async findAll(
    @Query("search") search?: string,
    @Query("status") status?: number,
    @Query("page") page?: number,
    @Query("itemsPerPage") itemsPerPage?: number,
    @Query("sortBy") sortBy?: string,
    @Query("sortDesc") sortDesc?: boolean
  ) {
    const params: FindUserDto = {
      search: search || "",
      status: status,
      pageable: getPageable(Number(page), Number(itemsPerPage)),
      sort: getSort(sortBy, sortDesc),
    };
    const data = await this.userService.findAll(params);
    const total = await this.userService.count(params);
    return { data: { count: total, list: data } };
  }

  @Post()
  @Roles({ module: Module.USER, permission: Permission.CREATE })
  async create(@Users() userRequest, @Body() data: CreateUserDto) {
    return await this.userService.create(userRequest, data);
  }

  @Get(":id")
  @Roles({ module: Module.USER, permission: Permission.READ })
  async getDetail(@Param("id") id: number) {
    return await this.userService.findOne(Number(id));
  }

  @Put(":id")
  @Roles({ module: Module.USER, permission: Permission.UPDATE })
  async update(
    @Users() userRequest,
    @Param("id") id: number,
    @Body() data: UpdateUserDto
  ) {
    return await this.userService.update(userRequest, Number(id), data);
  }

  @Delete(":id")
  @Roles({ module: Module.USER, permission: Permission.DELETE })
  async delete(@Users() userRequest, @Param("id") id: number) {
    return await this.userService.delete(userRequest, Number(id));
  }

  @ApiOperation({ summary: "Active verified user " })
  @Patch(":id/active")
  @Roles({ module: Module.USER, permission: Permission.UPDATE })
  async active(@Users() userRequest, @Param("id") id: number) {
    return await this.userService.active(userRequest, Number(id));
  }

  @ApiOperation({ summary: "deactivate verified user" })
  @Patch(":id/deactivate")
  @Roles({ module: Module.USER, permission: Permission.UPDATE })
  async deactivate(@Users() userRequest, @Param("id") id: number) {
    return await this.userService.deactivate(userRequest, Number(id));
  }

  @ApiOperation({ summary: "check exists user" })
  @ApiQuery({ name: "email", required: true })
  @ApiQuery({ name: "id", required: false })
  @Get("/email-exists")
  @Roles({ module: Module.USER, permission: Permission.READ })
  async emailExists(@Query("email") email: string, @Query("id") id?: number) {
    return await this.userService.emailExists(email, id);
  }
}
