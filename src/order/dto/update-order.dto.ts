import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber, IsEnum } from "class-validator";
import { OrderStatus } from "src/common/types";

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  projectName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  service?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  uploadImage?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  servicePrice?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  designStyle?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  photoDetail?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  photoCompleted?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  additionalService?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  additionalServicePrice?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  orderTotal?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  isAgreed?: number;
}
