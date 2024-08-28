import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { IBcryptService } from "src/infrustructure/adapters/bcrypt.interface";
import { UpdateRefreshTokenCommand } from "../../impl/auth/update-refresh-token-command";
import { IUserRepository } from "src/domain/adapters/repository.interface";
import { JWTConfig } from "src/domain/adapters/jwt.interface";
import { IJwtService, IJwtServicePayload } from "src/infrustructure/adapters/jwt-service.interface";




@CommandHandler(UpdateRefreshTokenCommand)
export class UpdateRefreshTokenCommandHandler implements ICommandHandler<UpdateRefreshTokenCommand>{
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

    async execute({updateRefreshTokenDto}: UpdateRefreshTokenCommand): Promise<any> {
        const { userId } = updateRefreshTokenDto;
        // find token from cache
        // activate user
        const user = await this.userRepository.findOneById(userId);

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