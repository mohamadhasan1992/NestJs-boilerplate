import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { EnvironmentConfigModule } from "../config/environment-config.module";
import { EnvironmentConfigService } from "../config/environment-config.service";



export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [EnvironmentConfigModule],
    useFactory: async (environmentConfigService: EnvironmentConfigService) => {
      const store = await redisStore({
        socket: {
            host: environmentConfigService.getRedisHost(),
            port: environmentConfigService.getRedisPort(),
      },
    });
      return {
        store: () => store,
      };
    },
    inject: [EnvironmentConfigService],
};
