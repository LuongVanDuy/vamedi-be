import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class ServeStaticExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === "ENOENT") {
      response.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(status).json({
        status: status,
        message: exception.message || "Internal server error",
      });
    }
  }
}
