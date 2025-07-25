import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { PostModule } from "./post/post.module";
import { OrderModule } from "./order/order.module";
import { FileModule } from "./file/file.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { TagModule } from "./tag/tag.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    TagModule,
    OrderModule,
    FeedbackModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
