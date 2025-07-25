import { Module } from "@nestjs/common";
import { MailModule } from "src/mail/mail.module";
import { TagService } from "./tag.service";
import { TagController } from "./tag.controller";

@Module({
  imports: [MailModule],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
