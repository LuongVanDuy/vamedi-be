import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compareSync, hashSync } from "bcrypt";
import { PrismaService } from "src/prisma.service";
import { JwtDto } from "./dto/jwt.dto";
import { LoginDto } from "./dto/login.dto";
import { exclude, generatePassword } from "../common/functions";
import { Token } from "./dto/token.dto";
import { SuccessType, UserStatus, UserType } from "src/common/types";
import { MailService } from "src/mail/mail.service";
import { SignupDto } from "./dto/signup.dto";
import { VerifyDto } from "./dto/verify.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async validateUser(payload: JwtDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(payload.id),
      },
    });

    if (user) {
      return {
        ...exclude(user, "password"),
      };
    }

    return null;
  }

  async syncGoogleUser(userData: {
    email: string;
    name: string;
    picture: string;
    phone?: string;
  }) {
    const { email, name, picture, phone } = userData;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    const verifyToken = this.jwtService.sign({ email }, { expiresIn: "1h" });

    const rawPassword = generatePassword();

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          avatar: picture,
          type: UserType.CUSTOMER,
          status: UserStatus.ACTIVATED,
          verified: 1,
          createdTime: new Date(),
          updatedTime: new Date(),
          phone: phone || null,
          password: hashSync(rawPassword, 10),
        },
      });

      await this.prisma.emailVerify.create({
        data: {
          email: user.email,
          verifyToken: verifyToken,
        },
      });

      return {
        data: {
          id: user.id,
          email: user.email,
          verifyToken,
        },
        success: true,
        type: SuccessType.CREATE,
      };
    } else {
      user = await this.prisma.user.update({
        where: { email },
        data: {
          name,
          avatar: picture,
          updatedTime: new Date(),
          phone: phone || null,
        },
      });

      await this.prisma.emailVerify.upsert({
        where: { email: user.email },
        update: { verifyToken: verifyToken },
        create: { email: user.email, verifyToken: verifyToken },
      });

      return {
        data: {
          id: user.id,
          email: user.email,
          verifyToken,
        },
        success: true,
        type: SuccessType.UPDATE,
      };
    }
  }

  async validateUserByToken(email: string, verifyToken: string) {
    const emailVerifyRecord = await this.prisma.emailVerify.findUnique({
      where: { email },
    });

    if (!emailVerifyRecord || emailVerifyRecord.verifyToken !== verifyToken) {
      throw new BadRequestException("Invalid token or email.");
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.deleteFlg === 1) {
      throw new NotFoundException("User not found or account is deleted.");
    }

    const payload: JwtDto = {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
      isSuperAdmin: user.isSuperAdmin,
    };

    await this.prisma.emailVerify.delete({
      where: { email },
    });

    const token = this.signToken(payload);

    return { ...payload, ...token };
  }

  signTokenGoogle(payload: any) {
    return this.jwtService.sign(payload);
  }

  async login(data: LoginDto, userType: UserType) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user || user.type !== userType || user.deleteFlg === 1) {
      throw new NotFoundException(
        "Login failed: user not found or account is deleted."
      );
    }
    if (user.verified == 0) {
      throw new BadRequestException("Account is not verified.");
    }
    if (user.status !== UserStatus.ACTIVATED) {
      throw new BadRequestException("Account is not active.");
    }
    if (!compareSync(data.password, user.password)) {
      throw new BadRequestException("Login failed: incorrect password.");
    }

    const payload: JwtDto = {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
      isSuperAdmin: user.isSuperAdmin,
    };

    const token = this.signToken(payload);
    return { ...payload, ...token };
  }

  signToken(payload: JwtDto): Token {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get<string>("EXPIRES_REFRESH_IN", "7d"),
    });
    const expiredAt = this.jwtService.decode(accessToken)["exp"] as number;
    return {
      accessToken,
      refreshToken,
      expiredAt,
    };
  }

  refreshToken(refreshToken: string): Token {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      });
      const { iat, exp, ...rest } = payload;
      const token = this.signToken(rest);
      return { ...rest, ...token };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async signup(data: SignupDto) {
    const exist = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exist) {
      throw new ConflictException("User already exists.");
    }

    if (!data.email || !data.password || !data.name) {
      throw new BadRequestException("Email, password, and name are required.");
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        type: UserType.CUSTOMER,
        status: UserStatus.ACTIVATED,
        verified: 1,
        name: data.name,
        phone: data.phone,
        password: hashSync(data.password, 10),
        createdTime: new Date(),
        updatedTime: new Date(),
      },
    });

    const emailverify = await this.prisma.emailVerify.findUnique({
      where: {
        email: data.email,
      },
    });

    if (emailverify) {
      await this.prisma.emailVerify.delete({
        where: {
          id: emailverify.id,
        },
      });
    }

    await this.mailService.sendMail({
      from: this.configService.get("SMTP_FROM_EMAIL"),
      to: [user.email],
      subject: "Signup",
      template: "signup",
      context: {
        name: user.name,
        domain: process.env.DOMAIN,
        logoUrl: "https://funface.vn/wp-content/uploads/2024/11/Logo.png",
      },
    });

    return { id: user?.id, success: true, type: SuccessType.CREATE };
  }

  async verifyUserEmail(data: VerifyDto) {
    const { email, verifyToken } = data;
    const emailVerify = await this.prisma.emailVerify.findFirst({
      where: { email },
    });

    if (!emailVerify) {
      throw new NotFoundException("User not found");
    }

    if (emailVerify.verifyToken !== verifyToken) {
      throw new BadRequestException("Invalid verify token");
    }
    return { id: emailVerify.id, success: true };
  }

  async logout(id: number): Promise<any> {
    // not implement
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new NotFoundException("User not exist");
    }

    if (user.status !== UserStatus.ACTIVATED) {
      throw new BadRequestException("User not active");
    }

    const token = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: "1h" }
    );

    await this.prisma.emailVerify.upsert({
      where: { email: user.email },
      update: { verifyToken: token },
      create: { email: user.email, verifyToken: token },
    });

    const resetLink = `${this.configService.get("DOMAIN")}/auth/forgot-password?token=${token}`;

    await this.mailService.sendMail({
      from: this.configService.get("SMTP_FROM_EMAIL"),
      to: [user.email],
      subject: "Forgot Password",
      template: "forgot-password",
      context: {
        name: user.name,
        resetLink,
        domain: process.env.DOMAIN,
        logoUrl: "https://funface.vn/wp-content/uploads/2024/11/Logo.png",
      },
    });

    return { success: true, type: user.type };
  }

  async resetPassword(data: ResetPasswordDto) {
    const { token, newPassword } = data;

    const emailVerify = await this.prisma.emailVerify.findFirst({
      where: { verifyToken: token },
    });

    if (!emailVerify) {
      throw new BadRequestException("Invalid or expired token");
    }

    try {
      const payload = this.jwtService.verify(token);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      const hashedPassword = hashSync(newPassword, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await this.prisma.emailVerify.update({
        where: { email: emailVerify.email },
        data: { verifyToken: null },
      });

      return { success: true, message: "Password has been reset successfully" };
    } catch (error) {
      throw new BadRequestException("Invalid or expired token");
    }
  }

  async changePassword(data: ChangePasswordDto, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!compareSync(data.password, user.password)) {
      throw new BadRequestException("Password is invalid");
    }
    if (!data.newPassword) {
      throw new BadRequestException("New passwsord must be not empty");
    }
    if (data.newPassword !== data.confirmNewPassword) {
      throw new BadRequestException("Confirm new passwsord is not match");
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashSync(data.newPassword, 10) },
    });

    return {
      message: "success",
    };
  }

  async updateProfile(data: UpdateProfileDto, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not exist");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        avatar: data.avatar,
        lastName: data.lastName,
        companyName: data.companyName,
        companyURL: data.companyURL,
        updatedUser: userId,
        updatedTime: new Date(),
      },
    });

    return { id: updatedUser.id, success: true, type: SuccessType.UPDATE };
  }

  async removeNewPerson(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not exist");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        newPerson: 0,
        updatedUser: userId,
        updatedTime: new Date(),
      },
    });

    return { id: updatedUser.id, success: true, type: SuccessType.UPDATE };
  }
}
