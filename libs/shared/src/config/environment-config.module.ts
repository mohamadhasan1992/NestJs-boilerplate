import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { EnvironmentConfigService } from './environment-config.service';

@Module({})
export class EnvironmentConfigModule {
  static forRoot(envFilePath: string, validate: (config: Record<string, unknown>) => Record<string, unknown>): DynamicModule {
    return {
      module: EnvironmentConfigModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath,
          isGlobal: true,
          validate,
        } as ConfigModuleOptions),
      ],
      providers: [EnvironmentConfigService],
      exports: [EnvironmentConfigService],
    };
  }
}
