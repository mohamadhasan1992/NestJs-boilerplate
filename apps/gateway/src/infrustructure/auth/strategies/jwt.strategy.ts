import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { IAuthenticatedUser, UserTokenPayload } from "@app/common";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { catchError, lastValueFrom, map } from "rxjs";
import { AuthService } from "apps/api-gateway/src/application/services/auth.service";



@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly authService: AuthService
    ){
        super({
            jwtFromRequest:  ExtractJwt.fromExtractors([
                (request: any) => request?.cookies?.Authentication || request?.Authentication || this.extractTokenFromHeader(request)
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>("JWT_SECRET")
        })
    }


    async validate({userId}: UserTokenPayload){
        if(!userId){
            throw new UnauthorizedException("unAuthenticated! please login first!")
        }
        // check for cached
        const cachedUser: string = await this.cacheManager.get(userId);
        if(cachedUser){
            return cachedUser
        }
        // If user not found, fetch user from authService
        try {
            const user: IAuthenticatedUser = await lastValueFrom(
                (await this.authService.getMe({ userId })).pipe(
                    map((user: IAuthenticatedUser) => {
                        return user;
                    }),
                    catchError(error => {
                        throw new UnauthorizedException(error.message);
                    })
                )
            );

            return user;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }

}

