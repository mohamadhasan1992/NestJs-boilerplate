// import { Module, DynamicModule } from '@nestjs/common';
// import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
// import { EnvironmentConfigService } from './environment-config.service';

// @Module({})
// export class EnvironmentConfigModule {
//   static forRoot(
//     envFilePath: string, 
//     validate: (config: Record<string, unknown>) => Record<string, unknown>
//   ): DynamicModule {
//     return {
//       module: EnvironmentConfigModule,
//       imports: [
//         ConfigModule.forRoot({
//           envFilePath,
//           isGlobal: true,
//           validate,
//           load: [() => {
//             console.log('Config Loaded:', process.env);  // Add this to check
//             return process.env;
//           }]
//         } as ConfigModuleOptions),
//       ],
//       providers: [EnvironmentConfigService],
//       exports: [EnvironmentConfigService],
//     };
//   }
// }
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigService } from './environment-config.service';




@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: './env/local.env',
      isGlobal: true,
      // validate,
    }),
  ],
  providers: [EnvironmentConfigService],
  exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {}

