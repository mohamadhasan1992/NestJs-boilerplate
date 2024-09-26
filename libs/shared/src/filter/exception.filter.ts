import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { LoggerService } from '@shared/shared/logger/logger.service';
import { status as RpcStatus } from '@grpc/grpc-js';

interface IError {
  message: string;
  code_error: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const contextType = host.getType();
    
    // Handle HTTP or gRPC based on context type
    if (contextType === 'http') {
      this.handleHttpError(exception, host);
    } else if (contextType === 'rpc') {
      this.handleGrpcError(exception, host);
    }
  }

  private handleHttpError(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as IError)
        : { message: (exception as Error).message, code_error: null };

    const responseData = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...message,
    };

    this.logMessage(request, message, status, exception);
    response.status(status).json(responseData);
  }

  private handleGrpcError(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const data = ctx.getData();

    let errorResponse: any;
    let statusCode: number;

    if (exception instanceof RpcException) {
      const err = exception.getError();
      errorResponse = typeof err === 'object' ? err : { message: err };
      statusCode = RpcStatus.UNKNOWN; // Default gRPC status code
    } else {
      errorResponse = { message: (exception as Error).message };
      statusCode = RpcStatus.INTERNAL; // gRPC Internal Server Error
    }

    this.logGrpcMessage(data, errorResponse, statusCode, exception);

    return { code: statusCode, message: errorResponse.message };
  }

  private logMessage(request: any, message: IError, status: number, exception: any) {
    if (status === 500) {
      this.logger.error(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} code_error=${message.code_error ?? null} message=${message.message ?? null}`,
        exception.stack,
      );
    } else {
      this.logger.warn(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} code_error=${message.code_error ?? null} message=${message.message ?? null}`,
      );
    }
  }

  private logGrpcMessage(data: any, message: IError, status: number, exception: any) {
    if (status === RpcStatus.INTERNAL) {
      this.logger.error(
        `End gRPC Request`,
        `status=${status} code_error=${message.code_error ?? null} message=${message.message ?? null}`,
        exception.stack,
      );
    } else {
      this.logger.warn(
        `End gRPC Request`,
        `status=${status} code_error=${message.code_error ?? null} message=${message.message ?? null}`,
      );
    }
  }
}
