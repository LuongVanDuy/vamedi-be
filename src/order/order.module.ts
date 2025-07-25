import { Module } from "@nestjs/common";
import { MailModule } from "src/mail/mail.module";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";

@Module({
  imports: [MailModule],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
