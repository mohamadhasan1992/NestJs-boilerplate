import { Controller, Get, Param, UseGuards, Query, Post, Body, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrustructure/auth/guards/jwt-auth.guard';
import { ConversationService } from '../../application/services/conversation.service';
import { CurrentUser, IAuthenticatedUser } from '@shared/shared';
import { CreateConversationDto } from '../dto/conversation/createConversation.dto';
import { FilterQuery } from 'mongoose';




@Controller('conversation')
@UseGuards(JwtAuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}


  @Post()
  async createConversation(
    @CurrentUser() user: IAuthenticatedUser,
    @Body() createConversationDto: CreateConversationDto

  ){
    return await this.conversationService.create(createConversationDto, user._id)
  }

  @Delete(":id")
  async deleteConversation(
    @CurrentUser() user: IAuthenticatedUser,
    @Param("id") id: string
  ){
    return await this.conversationService.remove(id, user._id)
  }

  
  @Get(":id/message")
  async listMessage(
    @Query() {page, limit}: FilterQuery<any>,
    @CurrentUser() user: IAuthenticatedUser,
    @Param("id") conversationId: string
  ){
    return await this.conversationService.findConversationMessage({page, limit}, user._id, conversationId)    
  }

  @Get()
  async listConversation(
    @Query() {page, limit}: FilterQuery<any>,
    @CurrentUser() user: IAuthenticatedUser,
  ){
    return await this.conversationService.find({page, limit}, user._id)
  }
}
