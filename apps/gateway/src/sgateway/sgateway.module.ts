// import { Module } from '@nestjs/common';
// import { Gateway } from './gateway';
// import { GatewaySessionManager } from './gateway.session';

// @Module({
//   providers: [
//     Gateway,
//     {
//       provide: "GATEWAY_SESSION_MANAGER",
//       useClass: GatewaySessionManager,
//     },
//   ],
//   exports: [
//     Gateway,
//     {
//       provide: "GATEWAY_SESSION_MANAGER",
//       useClass: GatewaySessionManager,
//     },
//   ],
// })
// export class SgatewayModule {}
