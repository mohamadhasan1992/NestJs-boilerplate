import { DatabaseConfig } from "../../domain/adapters/database.interface";
import { JWTConfig } from "../../domain/adapters/jwt.interface";

export interface IConfigService extends DatabaseConfig, JWTConfig {}