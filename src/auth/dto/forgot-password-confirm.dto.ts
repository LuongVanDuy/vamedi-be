import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordConfirmDto {
  @ApiProperty()
  token: string;
}
