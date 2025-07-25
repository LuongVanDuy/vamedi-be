import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateFeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
