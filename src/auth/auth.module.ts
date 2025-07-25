import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./guards/jwt.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ApiKeyStrategy } from "./guards/api-key.strategy";
import { MailModule } from "src/mail/mail.module";
import { RedisModule } from "src/redis/redis.module";
import { GoogleStrategy } from "./google.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>("JWT_SECRET"),
          signOptions: {
            expiresIn: configService.get<string>("EXPIRES_IN", "1h"),
          },
        };
      },
      inject: [ConfigService],
    }),
    RedisModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ApiKeyStrategy, GoogleStrategy],
})
export class AuthModule {}
