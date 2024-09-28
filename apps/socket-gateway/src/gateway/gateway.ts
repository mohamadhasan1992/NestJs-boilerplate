import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  WebSocketServer,
  ConnectedSocket,
  WsException
} from '@nestjs/websockets';
import {Server} from "socket.io"
import { Inject } from '@nestjs/common';
import { IGatewaySessionManager } from './gateway.session';
import { Socket } from 'socket.io';


enum MessengerSocketEventsEnum{
  connect = "connect",
  heartBeat = "heartBeat",
  onConversationJoin = "onConversationJoin",
  userJoin = "userJoin",
  onConversationLeave = "onConversationLeave",
  userLeave = "userLeave",
  onTypingStart = "onTypingStart",
  onTypingStop = "onTypingStop",
  isOnline = "isOnline",
  onMessage = "onMessage",
  onConversation = "onConversation"

}

export interface AuthenticatedSocket extends Socket {
  user?: {
    _id: string;
    fullName: string
    email: string
  };
}

@WebSocketGateway(
  81,
  {
    cors: {
      origin: '*',
      credentials: true,
    },
    pingInterval: 10000,
    pingTimeout: 15000,
    transports: ['websocket', 'polling'],
  }
)
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject("GATEWAY_SESSION_MANAGER")
    readonly sessions: IGatewaySessionManager,
  ) {}

  @WebSocketServer()
  server: Server;


  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log("args", args)
    // check if user is connected
    const ifConnected = this.sessions.getUserSocket(socket.user._id);
    if(ifConnected) {
      return
    }
    this.sessions.setUserSocket((socket.user._id), socket);
    socket.emit(MessengerSocketEventsEnum.connect, {});
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    this.sessions.removeUserSocket((socket.user._id));
  }

 
  @SubscribeMessage(MessengerSocketEventsEnum.heartBeat)
  onHeartBeat(
    @ConnectedSocket() socket: AuthenticatedSocket,
  ){
    const client = this.sessions.getUserSocket(socket.user._id);
    if (client) {
      this.sessions.setUserSocket(socket.user._id, socket);
    }else{
    }
  }


  @SubscribeMessage(MessengerSocketEventsEnum.onConversationJoin)
  async onConversationJoin(
    @MessageBody() {conversationId}: {conversationId: string},
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if(!conversationId){
      throw new WsException('please send conversation id');
    }
    console.log("client", client)
    // check if user can join conversation
    // const conversation = await this.conversationService.findOne({_id: conversationId});
    // if(!conversation){
    //   throw new WsException('conversation not found');
    // }

    this.handleConversationJoin(client, conversationId)
  }

  async handleConversationJoin(client: AuthenticatedSocket, conversationId: string){
    console.log("client", client)
    console.log("conversationId", conversationId)
    // find conversation
    // if(
    //   client.user._id != conversation.creator &&
    //   client.user._id != conversation.recipient
    // ){
    //   return
    // }
    client.join(`conversation-${conversationId}`);
    this.server.to(`conversation-${conversationId}`).emit(MessengerSocketEventsEnum.userJoin, {_id: client.user._id, fullName: client.user.fullName});
}

  @SubscribeMessage(MessengerSocketEventsEnum.onConversationLeave)
  onConversationLeave(
    @MessageBody() {conversationId}: {conversationId: string},
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if(!conversationId){
      throw new WsException('please send conversation id');
    }
    client.leave(`conversation-${conversationId}`);
    this.server.to(`conversation-${conversationId}`).emit(MessengerSocketEventsEnum.userLeave);
  }


  @SubscribeMessage(MessengerSocketEventsEnum.onTypingStart)
  onTypingStart(
    @MessageBody() {conversationId}: {conversationId: string},
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    this.server.to(`conversation-${conversationId}`).emit(
      MessengerSocketEventsEnum.onTypingStart, 
      {
        _id: client.user._id, 
        fullName: client.user.fullName
      }
    );
  }

  @SubscribeMessage(MessengerSocketEventsEnum.onTypingStop)
  onTypingStop(
    @MessageBody() {conversationId}: {conversationId: string},
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    this.server.to(`conversation-${conversationId}`).emit(
      MessengerSocketEventsEnum.onTypingStop, 
      {
        _id: client.user._id, 
        fullName: client.user.fullName, 
      }
    );
  }


  @SubscribeMessage(MessengerSocketEventsEnum.isOnline)
  async isUserOnline(
    @MessageBody() {user}: {user: string},
    @ConnectedSocket() client: AuthenticatedSocket,
  ){
    const userSocket = this.sessions.getUserSocket(user);
    const payload = {
      isOnline: !!userSocket
    }
    client.emit(MessengerSocketEventsEnum.isOnline, payload)
  }


  // @OnEvent(MessengerEventsEnum.messageCreated)
  async handleMessageCreateEvent(
    payload: any 
    // CreateMessageResponse
  ) {
    const {
      conversation,
    } = payload;
    const { _id: conversationId} = conversation;
    // emit message to conversation room
    this.server.to(`conversation-${conversationId}`).emit(MessengerSocketEventsEnum.onMessage, payload)
  
  }

  // @OnEvent(MessengerEventsEnum.ConversationCreate)
  handleConversationCreateEvent(
    payload: any 
    // CreateConversationResponse
  ) {
    const {recipient} = payload;
    const recipientSocket = this.sessions.getUserSocket(recipient._id.toHexString());
    if (recipientSocket){
      recipientSocket.emit(MessengerSocketEventsEnum.onConversation, "new conversation created");
    } 
  }

}
