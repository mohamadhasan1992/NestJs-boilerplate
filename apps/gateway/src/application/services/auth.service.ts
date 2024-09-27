import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SignUpUserDto } from '../../../../../libs/shared/src/dto/auth/signup-user.dto';
import { LoginUserDto } from '../../../../../libs/shared/src/dto/auth/login-user.dto';
import { AUTH_SERVICE_NAME, AuthServiceClient, GetUserByEmailRequest, GetUserByEmailResponse, GetUserRequest } from '@shared/shared/proto/user';
import { ApiGatewayAuthKafkaService } from '../messaging/gateway-auth-kafka.service';
import { Observable } from 'rxjs';
import { AuthActionsEnum } from '@shared/shared/enum';




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
      const {message} = await this.kafkaService.sendRequestToAuthService(
        {
          ...signUpUserDto,
          action: AuthActionsEnum.Signup
        }
      );
      return {
        message
      }
    } 

    async loginUser(loginUserDto: LoginUserDto){
      const response = await this.kafkaService.sendRequestToAuthService(
        {
          ...loginUserDto,
          action: AuthActionsEnum.Login
        }
      );
      return {accessToken: response.accessToken}
    }

    async getUser(userId: string){
      const requestMe: GetUserRequest = {
        userId
      };
      return await this.authService.getMe(requestMe)
    }

    async getUserByEmail(email: string): Promise<Observable<GetUserByEmailResponse>>{
      const requestUserByEmail: GetUserByEmailRequest = {
        email
      };
      return await this.authService.getUserByEmail(requestUserByEmail)
    }


}
