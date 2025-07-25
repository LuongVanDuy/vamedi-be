import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsArray } from "class-validator";

export class UpdatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  slug: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  shortDesc?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  tags?: number[];
}
