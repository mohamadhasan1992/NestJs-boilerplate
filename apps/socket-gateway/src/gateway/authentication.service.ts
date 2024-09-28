import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IJwtService } from '@shared/shared';
import { AUTH_SERVICE_NAME, AuthServiceClient, GetUserRequest, GetUserResponse } from '@shared/shared/proto/user';
import { catchError, map } from 'rxjs';




@Injectable()
export class AuthenticationService implements OnModuleInit {
    private authService: AuthServiceClient

    constructor(
        @Inject("GRPC_USER_MANAGEMENT_SERVICE") private client: ClientGrpc,
        @Inject("JwtTokenService") private jwtTokenService: IJwtService
    ){}

    onModuleInit() {
        this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
    }

    async decodeToken(token: string){
        return await this.jwtTokenService.checkToken(token)
    }

    getUser(userId: string){
        const requestMe: GetUserRequest = {
            userId
        };
        return this.authService.getMe(requestMe)
            .pipe(
                map(({user}: GetUserResponse) => {
                  return user
                }),
                catchError(error => {
                  throw new InternalServerErrorException(error.message);
              })
            )
    }

}
