import { UpdateRefreshTokenDto } from "src/application/dto/auth/update-refresh.dto copy";



export class UpdateRefreshTokenCommand{
    constructor(
        public readonly updateRefreshTokenDto: UpdateRefreshTokenDto
    ){}
}