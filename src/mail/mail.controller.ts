import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendTestEmailDto } from "./dto/send-test-email.dto";
import { MailService } from "./mail.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ContactFormDto } from "./dto/contact-form.dto";
import { OrderCompletionDto } from "./dto/order-completion.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";

@ApiTags("Mail")
@Controller("mail")
export class MailController {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) {}

  @Post("/test")
  async test(@Body() data: SendTestEmailDto) {
    const fromEmail = this.configService.get("SMTP_FROM_EMAIL");

    await this.mailService.sendMail({
      from: fromEmail,
      to: data.to,
      subject: "Test email",
      template: "test",
      context: {
        id: 1,
        email: data.to,
        domain: process.env.DOMAIN,
        logoUrl: "https://funface.vn/wp-content/uploads/2024/11/Logo.png",
      },
    });

    return { success: true };
  }

  @Post("/contact-form")
  async handleContactForm(@Body() data: ContactFormDto) {
    const fromEmail = this.configService.get("SMTP_FROM_EMAIL");

    await this.mailService.sendMail({
      from: data.email,
      to: fromEmail,
      subject: "New Contact Request",
      template: "contact",
      context: {
        id: 1,
        fullname: data.fullname,
        email: data.email,
        phoneNumber: data.phoneNumber,
        message: data.message,
        domain: process.env.DOMAIN,
        logoUrl: "https://funface.vn/wp-content/uploads/2024/11/Logo.png",
      },
    });

    return { id: data.email, success: true };
  }

  @Post("/order-completion")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async handleOrderCompletion(@Body() orderData: OrderCompletionDto) {
    const fromEmail = this.configService.get("SMTP_FROM_EMAIL");

    await this.mailService.sendMail({
      from: fromEmail,
      to: orderData.email,
      subject: "Your Order is Complete",
      template: "order-completion",
      context: {
        orderId: orderData.orderId,
        service: orderData.service,
        designStyle: orderData.designStyle,
        additionalService: orderData.additionalService,
        orderTotal: orderData.orderTotal,
        createdTime: orderData.createdTime,
        domain: process.env.DOMAIN,
        logoUrl: "https://funface.vn/wp-content/uploads/2024/11/Logo.png",
      },
    });

    return { id: orderData.orderId, success: true };
  }
}
