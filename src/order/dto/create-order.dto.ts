import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
  @IsNotEmpty()
  subService: string;

  @ApiProperty()
  @ApiProperty()
  uploadImage: string;

  @ApiProperty()
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  @ApiProperty()
  servicePrice: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  orderTotal?: number;
}
