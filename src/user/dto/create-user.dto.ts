import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false })
  companyName?: string;

  @ApiProperty({ required: false })
  companyURL?: string;
}
