import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SignUpUserDto } from '../../presentation/dto/auth/signup-user.dto';
import { LoginUserDto } from '../../presentation/dto/auth/login-user.dto';
import { AUTH_SERVICE_NAME, AuthServiceClient, GetUserRequest } from '@shared/shared/proto/user';
import { ApiGatewayAuthKafkaService } from '../messaging/gateway-auth-kafka.service';
import { AuthActionsEnum } from '@shared/shared/enum/incex';




@Injectable()
export class AuthService implements OnModuleInit {
    private authService: AuthServiceClient

    constructor(
      @Inject("GRPC_USER_MANAGEMENT_SERVICE") private client: ClientGrpc,
      private readonly kafkaService: ApiGatewayAuthKafkaService
    ){}

    onModuleInit() {
      this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
    }


    async sinupUser(signUpUserDto: SignUpUserDto){
      const {success, data, message} = await this.kafkaService.sendRequestToAuthService(
        {
          ...signUpUserDto,
          action: AuthActionsEnum.Signup
        }
      );
      return {
        success, data, message
      }
    } 

    async loginUser(loginUserDto: LoginUserDto){
      const {success, data, message} = await this.kafkaService.sendRequestToAuthService(
        {
          ...loginUserDto,
          action: AuthActionsEnum.Login
        }
      );

      return {
        success, data, message      
      }
    }

    async getUser(userId: string){
      const requestMe: GetUserRequest = {
        userId
      };
      return this.authService.getMe(requestMe)
    }


}
