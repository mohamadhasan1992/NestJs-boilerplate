import { JwtStrategy } from "./jwt.strategy";
import { JwtRefreshTokenStrategy } from "./jwtRefresh.strategy";
import { LocalStrategy } from "./local.strategy";



export const AuthStrategies = [
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy
]