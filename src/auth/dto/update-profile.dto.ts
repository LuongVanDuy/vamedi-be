import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  companyName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  companyURL?: string;
}
