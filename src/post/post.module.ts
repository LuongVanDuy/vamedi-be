import { Module } from "@nestjs/common";
import { MailModule } from "src/mail/mail.module";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";

@Module({
  imports: [MailModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
