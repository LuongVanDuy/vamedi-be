import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { UserStatus } from "src/common/types";

export class UpdateStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  status: UserStatus;
}
