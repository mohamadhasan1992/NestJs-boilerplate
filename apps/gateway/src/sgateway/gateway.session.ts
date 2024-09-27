// import { Injectable } from '@nestjs/common';
// import { AuthenticatedSocket } from './gateway';



// export interface IGatewaySessionManager {
//   getUserSocket(id: string): AuthenticatedSocket;
//   setUserSocket(id: string, socket: AuthenticatedSocket): void;
//   removeUserSocket(id: string): void;
// }

// @Injectable()
// export class GatewaySessionManager implements IGatewaySessionManager {
//   private readonly sessions: Map<string, { socket: AuthenticatedSocket, lastHeartbeat: number }> = new Map();


//   constructor() {}

//   getUserSocket(id: string) {
//     const session = this.sessions.get(id);
//     if(!!session){
//       return session.socket;
//     }
//   }

//   setUserSocket(userId: string, socket: AuthenticatedSocket) {
//     this.sessions.set(userId, {socket, lastHeartbeat: Date.now()});
//   }

//   removeUserSocket(userId: string) {
//     this.sessions.delete(userId);
//   }


  
// }