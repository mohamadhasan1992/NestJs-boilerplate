import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PB_PACKAGE_NAME } from '../proto/user';

export const grpcUserOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: PB_PACKAGE_NAME,
    protoPath: join(__dirname, '../proto/user.proto'),
    url: 'user-management:50051',
  },
};

export const grpcMessengerOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: PB_PACKAGE_NAME,
    protoPath: join(__dirname, '../proto/messenger.proto'),
    url: 'messenger:50052',
  },
};
