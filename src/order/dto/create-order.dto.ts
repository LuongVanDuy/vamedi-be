import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty()
  @IsNotEmpty()
  service: string;

  @ApiProperty()
  @ApiProperty()
  uploadImage: string;

  @ApiProperty()
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  @ApiProperty()
  servicePrice: number;
}
