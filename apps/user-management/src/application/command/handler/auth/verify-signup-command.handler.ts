import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { VerifySignupTokenCommand } from "../../impl/auth/verify-signup.command";
import { I18nService } from 'nestjs-i18n';
import { IUserRepository } from "apps/user-management/src/domain/adapters/repository.interface";
import { IBcryptService, IJwtService, IJwtServicePayload } from "@shared/shared";
import { JWTConfig } from "apps/user-management/src/domain/adapters/jwt.interface";





@CommandHandler(VerifySignupTokenCommand)
export class VerifySignUpTokenCommandHandler implements ICommandHandler<VerifySignupTokenCommand>{
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: IUserRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject("JwtService")
        private readonly jwtTokenService: IJwtService,
        @Inject("JwtConfig")
        private readonly jwtConfig: JWTConfig,
        @Inject("BcryptService")
        private readonly bcryptService: IBcryptService,
        private readonly i18nService: I18nService
        ){}

    async execute({verifySignUpTokenDto}: VerifySignupTokenCommand): Promise<any> {
        const { phone_number, uuid } = verifySignUpTokenDto;
        // find token from cache
        const cachedUuid = await this.cacheManager.get(phone_number);
        // check for UUID
        if(uuid !== cachedUuid){
            throw new BadRequestException(this.i18nService.t("error.TOKEN_IS_NOT_VALID"))
        }
        // activate user
        const user = await this.userRepository.findByPhoneNumber(phone_number);
        user.activateUser()
        await this.userRepository.findOneAndReplaceById(user.getId(), user);
        

        const payload: IJwtServicePayload = { userId: user.getId() };
        const jwtSecret = this.jwtConfig.getJwtSecret();
        const jwtExpiresIn = this.jwtConfig.getJwtExpirationTime() + 's';
        const token = this.jwtTokenService.createToken(payload, jwtSecret, jwtExpiresIn);
        const refreshSecret = this.jwtConfig.getJwtRefreshSecret();
        const refreshExpiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
        const refreshToken = this.jwtTokenService.createToken(payload, refreshSecret, refreshExpiresIn);
        await this.setCurrentRefreshToken(refreshToken, user.getId());
        return { accessTokenCookie: token, refreshTokenCookie: refreshToken };
    }


    async setCurrentRefreshToken(refreshToken: string, userId: string) {
        const currentHashedRefreshToken = await this.bcryptService.hash(refreshToken);
        await this.userRepository.updateRefreshToken(userId, currentHashedRefreshToken);
    }
}