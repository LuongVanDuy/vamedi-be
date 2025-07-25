import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChangeEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
