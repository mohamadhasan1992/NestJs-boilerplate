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
      console.log("sending signup to kafka")
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
      console.log("success", success)
      console.log("data", data)
      console.log("message", message)
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

    async getUserByEmail(email: string): Promise<Observable<GetUserByEmailResponse>>{
      const requestUserByEmail: GetUserByEmailRequest = {
        email
      };
      return await this.authService.getUserByEmail(requestUserByEmail)
    }


}
