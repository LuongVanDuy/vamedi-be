import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordCompleteDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  confirmNewPassword: string;
}
