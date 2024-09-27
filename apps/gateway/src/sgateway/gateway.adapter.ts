// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { INestApplicationContext } from "@nestjs/common"
// import { AUTH_SERVICE_NAME, AuthServiceClient } from '@shared/shared/proto/user';
// // import { ClientGrpc } from '@nestjs/microservices';
// // import { AuthenticatedSocket } from './gateway';
// import { createAdapter } from '@socket.io/redis-adapter';
// import { createClient } from 'redis';

// export class WebsocketAdapter extends IoAdapter {
//   private adapterConstructor: ReturnType<typeof createAdapter>;
//   private authService: AuthServiceClient

//   constructor(
//     private app: INestApplicationContext,
//   ) {
//     super(app);
//     const authService = app.get<AuthServiceClient>(AUTH_SERVICE_NAME)
//     this.authService = authService;
//   }

//   async connectToRedis(): Promise<void> {
//     const pubClient = createClient({ url: `redis://localhost:6379` });
//     const subClient = pubClient.duplicate();

//     await Promise.all([pubClient.connect(), subClient.connect()]);

//     this.adapterConstructor = createAdapter(pubClient, subClient);
//   }

//   createIOServer(port: number, options?: any) {
//     console.log("handling socket request")
//     const server = super.createIOServer(port, options);
//     // server.use(async (socket: AuthenticatedSocket, next) => {
//     //   // console.log("handshake headers", socket.handshake.headers.cookie)
//     //   let { cookie: clientCookie } = socket.handshake.headers;
//     //   if (!clientCookie) {
//     //     return next(new Error('Not Authenticated. No cookies were sent'));
//     //   }
//     //   // authenticate using main service
//     //   try {
//     //     // Authenticate the cookie using the authentication service
//     //     console.log("clientCookie", clientCookie)
//     //     const match = clientCookie.match(/(?:^|;)\s*Authentication=(.*?)(?=;|$)/);
//     //     console.log("match", match)
//     //     if (match) {
//     //       clientCookie = match[1];
//     //       // console.log("clientCookie", clientCookie)
//     //     } else {
//     //       return next(new Error('Authentication failed: ' + "you are not loged in"));
//     //     }
//     //     const user = await this.authService.authenticate(clientCookie);
//     //     if (!user) {
//     //       return next(new Error('Authentication failed'));
//     //     }
//     //     // Attach the authenticated user to the socket for further use
//     //     socket.user = user;
//     //     next();
//     //   } catch (error) {
//     //     return next(new Error('Authentication failed: ' + error.message));
//     //   }

//     // });
//     return server;
//   }
// }