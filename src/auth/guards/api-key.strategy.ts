import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  "api-key"
) {
  constructor(private readonly configService: ConfigService) {
    super({ header: "X-API-KEY", prefix: "" }, true, async (apiKey, done) => {
      this.validate(apiKey, done);
    });
  }

  private validate(apiKey: string, done: (error: Error, data) => any) {
    if (this.configService.get<string>("API_KEY") === apiKey) {
      done(null, true);
    }
    done(new UnauthorizedException(), null);
  }
}
