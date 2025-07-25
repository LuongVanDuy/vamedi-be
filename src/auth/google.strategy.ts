import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";

import { AuthService } from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN}/oauth/google/callback`,
      scope: ["email", "profile"],
    });
  }

  authorizationParams(): Record<string, string> {
    return {
      prompt: "select_account",
    };
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, emails, photos } = profile;
    const user = {
      name: name.givenName + " " + name.familyName,
      email: emails[0].value,
      avatar: photos[0].value,
    };
    return user;
  }
}
