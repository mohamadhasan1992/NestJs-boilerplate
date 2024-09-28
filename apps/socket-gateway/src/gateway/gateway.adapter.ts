import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from "@nestjs/common"
import { AuthenticatedSocket } from './gateway';
import { createAdapter } from '@socket.io/redis-adapter';
// import { createClient } from 'redis';
import { AuthenticationService } from './authentication.service';
import { lastValueFrom } from 'rxjs';

export class WebsocketAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private authenticationService: AuthenticationService;

  constructor(
    private app: INestApplicationContext,
  ) {
    super(app);
    const authService = app.get<AuthenticationService>(AuthenticationService)
    this.authenticationService = authService;
  }

  // async connectToRedis(): Promise<void> {
  //   const pubClient = createClient({ url: `redis://localhost:6379` });
  //   const subClient = pubClient.duplicate();

  //   await Promise.all([pubClient.connect(), subClient.connect()]);

  //   this.adapterConstructor = createAdapter(pubClient, subClient);
  // }

  createIOServer(port: number, options?: any) {
    console.log("handling socket request")
    const server = super.createIOServer(port, options);
    server.use(async (socket: AuthenticatedSocket, next) => {
      // console.log("handshake headers", socket.handshake.headers.cookie)
      let { cookie: clientCookie } = socket.handshake.headers;
      if (!clientCookie) {
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      // authenticate using main service
      try {
        // Authenticate the cookie using the authentication service
        console.log("clientCookie", clientCookie)
        const match = clientCookie.match(/(?:^|;)\s*Authentication=(.*?)(?=;|$)/);
        console.log("match", match)
        if (match) {
          clientCookie = match[1];
          // console.log("clientCookie", clientCookie)
        } else {
          return next(new Error('Authentication failed: ' + "you are not loged in"));
        }
        // get userId from cookie
        const token = await this.authenticationService.decodeToken(clientCookie)
        // 
        if(!token || !token.userId){
          return next(new Error('Authentication failed'));
        }
        const user = await lastValueFrom(this.authenticationService.getUser(token.userId)); 
        if (!user) {
          return next(new Error('Authentication failed'));
        }
        // Attach the authenticated user to the socket for further use
        socket.user = {
          _id: user.ID,
          fullName: user.fullName,
          email: user.email

        };
        next();
      } catch (error) {
        return next(new Error('Authentication failed: ' + error.message));
      }

    });
    return server;
  }
}