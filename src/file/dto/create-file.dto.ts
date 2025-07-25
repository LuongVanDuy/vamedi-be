import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateFileDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  file: Express.Multer.File;
}
