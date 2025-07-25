import { Module } from "@nestjs/common";
import { MailModule } from "src/mail/mail.module";
import { FeedbackService } from "./feedback.service";
import { FeedbackController } from "./feedback.controller";

@Module({
  imports: [MailModule],
  providers: [FeedbackService],
  controllers: [FeedbackController],
  exports: [FeedbackService],
})
export class FeedbackModule {}
