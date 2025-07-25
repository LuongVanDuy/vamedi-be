import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class OrderCompletionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  service: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  designStyle?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  additionalService?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  orderTotal: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  createdTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;
}
