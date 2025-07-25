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
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Module, Permission } from "src/common/types";
import { FindPostDto } from "./dto/find-post.dto";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { Users } from "src/common/decorators/users.decorator";
import { User } from "@prisma/client";
import { UpdatePostDto } from "./dto/update-post.dto";

@ApiTags("Posts")
@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "itemsPerPage", required: false })
  @ApiQuery({ name: "sortBy", required: false })
  @ApiQuery({ name: "sortDesc", required: false })
  @ApiQuery({
    name: "contentLength",
    required: false,
    description: "Number of characters of content to return",
  })
  @ApiQuery({
    name: "tag",
    required: false,
    description: "Filter posts by tag name",
  })
  async findAll(
    @Query("search") search?: string,
    @Query("status") status?: number,
    @Query("page") page?: number,
    @Query("itemsPerPage") itemsPerPage?: number,
    @Query("sortBy") sortBy?: string,
    @Query("sortDesc") sortDesc?: boolean,
    @Query("tag") tag?: string,
    @Query("contentLength") contentLength?: number
  ) {
    const params: FindPostDto = {
      search: search || "",
      status: status,
      pageable: getPageable(Number(page), Number(itemsPerPage)),
      sort: getSort(sortBy, sortDesc),
      tag: tag,
      contentLength: contentLength,
    };
    const data = await this.postService.findAll(params);
    const total = await this.postService.count(params);
    return { data: { count: total, list: data } };
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles({ module: Module.POST, permission: Permission.CREATE })
  async create(@Users() userRequest, @Body() data: CreatePostDto) {
    return await this.postService.create(userRequest, data);
  }

  @Get("slug/:slug")
  async findOneBySlug(@Param("slug") slug: string) {
    return await this.postService.findOneBySlug(slug);
  }

  @Get("id/:id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles({ module: Module.POST, permission: Permission.READ })
  async findOneById(@Param("id") id: string) {
    return await this.postService.findOneById(Number(id));
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles({ module: Module.POST, permission: Permission.UPDATE })
  async update(
    @Users() userRequest: User,
    @Param("id") id: number,
    @Body() data: UpdatePostDto
  ) {
    return await this.postService.update(userRequest, id, data);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles({ module: Module.POST, permission: Permission.DELETE })
  async delete(
    @Users() userRequest,
    @Param("id") id: number,
    @Query("permanent") permanent?: string
  ) {
    const isPermanent = permanent === "true";
    return await this.postService.delete(userRequest, Number(id), isPermanent);
  }
}
