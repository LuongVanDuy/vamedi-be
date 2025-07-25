import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Delete,
  Param,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";

@ApiTags("File")
@Controller("file")
export class FileController {
  constructor(private fileService: FileService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.saveFile(file);
  }

  @Delete("delete/:fileName")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteFile(@Param("fileName") fileName: string) {
    return this.fileService.removeFile(fileName);
  }
}
