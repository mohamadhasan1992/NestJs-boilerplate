import { UpdateRefreshTokenDto } from "src/user/application/dto/auth/update-refresh.dto";



export class UpdateRefreshTokenCommand{
    constructor(
        public readonly updateRefreshTokenDto: UpdateRefreshTokenDto
    ){}
}