import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers || request.req.headers;
    if (headers && headers.authorization) {
      const token = headers.authorization.substr("Bearer ".length);
      return token;
    }
    return null;
  }
);
