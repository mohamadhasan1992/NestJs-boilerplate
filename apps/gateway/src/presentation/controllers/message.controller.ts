import { Controller, Param, UseGuards, Post, Delete, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MessageService } from '../../application/services/message.service';
import { CurrentUser, IAuthenticatedUser } from '@shared/shared';
import { CreateMessageDto } from '../dto/message/createMessage.dto';



@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}


  @Post()
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() user: IAuthenticatedUser
  ){
    return await this.messageService.create(createMessageDto, user._id)
  }

  @Delete(":id")
  async deleteMessage(
    @Param("id") id: string,
    @CurrentUser() user: IAuthenticatedUser
  ){
    return await this.messageService.remove(id, user._id)
  }
}
