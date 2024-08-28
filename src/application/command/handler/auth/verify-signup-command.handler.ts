import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { IBcryptService } from "src/infrustructure/adapters/bcrypt.interface";
import { VerifySignupTokenCommand } from "../../impl/auth/verify-signup.command";
import { IUserRepository } from "src/domain/adapters/repository.interface";
import { JWTConfig } from "src/domain/adapters/jwt.interface";
import { IJwtService, IJwtServicePayload } from "src/infrustructure/adapters/jwt-service.interface";





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
        private readonly bcryptService: IBcryptService
        ){}

    async execute({verifySignUpTokenDto}: VerifySignupTokenCommand): Promise<any> {
        const { phone_number, uuid } = verifySignUpTokenDto;
        // find token from cache
        const cachedUuid = await this.cacheManager.get(phone_number);
        // check for UUID
        if(uuid !== cachedUuid){
            throw new BadRequestException("error.TOKEN_IS_NOT_VALID")
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