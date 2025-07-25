import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { Token } from "./dto/token.dto";
import { AuthService } from "./auth.service";
import { UserType } from "src/common/types";
import { SignupDto } from "./dto/signup.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Users } from "src/common/decorators/users.decorator";
import { TokenRefreshDto } from "./dto/token-refresh.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { User } from "@prisma/client";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthGuard } from "@nestjs/passport";
import { LoginWithTokenDto } from "./dto/login-with-token.dto";

@ApiTags("Auth")
@Controller("")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Redirect to Google for authentication.",
  })
  async googleAuth() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req, @Res() res) {
    const user = req.user;
    const { email, name, picture } = user;
    const result = await this.authService.syncGoogleUser({
      email,
      name,
      picture,
    });
    return res.status(200).json(result);
  }

  @Post("login/token")
  async loginWithToken(@Body() data: LoginWithTokenDto): Promise<Token> {
    return await this.authService.validateUserByToken(
      data.email,
      data.verifyToken
    );
  }

  @Post("/login")
  async login(@Body() data: LoginDto): Promise<Token> {
    return await this.authService.login(data, UserType.CUSTOMER);
  }

  @Post("/signup")
  async signup(@Body() data: SignupDto) {
    return await this.authService.signup(data);
  }

  @Post("/admin/login")
  async adminLogin(@Body() data: LoginDto): Promise<Token> {
    return await this.authService.login(data, UserType.SYSTEM);
  }

  @Post("/logout")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async logout(@Users() user: any): Promise<void> {
    await this.authService.logout(user.id);
  }

  @Post("/refresh-token")
  async refreshToken(@Body() data: TokenRefreshDto): Promise<Token> {
    return this.authService.refreshToken(data.token);
  }

  @Get("/profile")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async profile(@Users() userRequest: User) {
    return userRequest;
  }

  @Post("/forgot-password")
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data);
  }

  @Post("/reset-password")
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post("/change-password")
  changePassword(@Users() userRequest: User, @Body() data: ChangePasswordDto) {
    return this.authService.changePassword(data, userRequest.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put("/update-profile")
  async updateProfile(
    @Users() userRequest: User,
    @Body() data: UpdateProfileDto
  ) {
    return this.authService.updateProfile(data, userRequest.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch("/removeNewPerson")
  async removeNewPerson(@Users() userRequest: User) {
    return await this.authService.removeNewPerson(userRequest.id);
  }
}
