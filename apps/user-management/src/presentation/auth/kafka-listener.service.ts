import { Injectable} from '@nestjs/common';
import { KafkaService } from '@shared/shared/messaging/kafka-streaming.service';
import { KafkaTopics, LoginUserDto, SignUpUserDto } from '@shared/shared';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpCommand } from '../../application/command/impl/auth/signup.command';
import { LoginCommand } from '../../application/command/impl/auth/login.command';
import { AuthActionsEnum } from '@shared/shared/enum';

@Injectable()
export class UserManagementKafkaService  {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly commandBus: CommandBus,
    ) {
        this.kafkaService.createConsumer(
            'user-management-group',
            KafkaTopics.KafkaAuthenticationRequestTopic,
            async (payload) => {
              const { value } = payload.message;
              const request = JSON.parse(value.toString());
      
              // Process the request
              const correlationId = request.correlationId;
              const gatewayData = await this.handleAuthRequest(request);
      
              await this.sendResponseToApiGateway(gatewayData, correlationId);
            }
        );
    }

  private async handleAuthRequest(request: any): Promise<any> {
    let response;
    switch (request.action) {
        case AuthActionsEnum.Signup:
            const singUpUserDto : SignUpUserDto = {
                email: request.email,
                password: request.password,
                fullName: request.fullName
            }
            response = await this.commandBus.execute(new SignUpCommand(singUpUserDto))
            break;
        case AuthActionsEnum.Login:
            const loginUserDto : LoginUserDto = {
                email: request.email,
                password: request.password,
            }
            response = await this.commandBus.execute(new LoginCommand(loginUserDto))
            break;
        default:
            break;
    }
    return response
  }

  private async sendResponseToApiGateway(userData: any, correlationId: string) {
    const response = { ...userData, correlationId };

    // Send the response to the KafkaAuthenticationResponseTopic
    await this.kafkaService.sendMessage(KafkaTopics.KafkaAuthenticationResponseTopic, [response]);
  }
}
