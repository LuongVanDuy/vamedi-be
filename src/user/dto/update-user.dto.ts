import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ required: false })
  companyName?: string;

  @ApiProperty({ required: false })
  companyURL?: string;
}
