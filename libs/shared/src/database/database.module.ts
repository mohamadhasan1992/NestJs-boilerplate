import { DynamicModule, Global, Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { EnvironmentConfigModule } from '../config/environment-config.module';
import { EnvironmentConfigService } from '../config/environment-config.service';


@Global()
@Module({
  imports: [
      MongooseModule.forRootAsync({
          imports: [EnvironmentConfigModule],
          useFactory: async (environmentConfigService: EnvironmentConfigService) => ({
              uri: environmentConfigService.getDatabaseHost()
          }),
          inject: [EnvironmentConfigService]
  })
  ],
})



export class DatabaseModule {

  static forFeature(models: ModelDefinition[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forFeature(models),
      ],
      exports: [MongooseModule],
    };
  }
}
