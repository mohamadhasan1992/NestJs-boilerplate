import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepository } from 'apps/user-management/src/domain/adapters/repository.interface';
import { GetUserByEmailQuery } from '../../impl/auth/get-user-by-email.query';




@QueryHandler(GetUserByEmailQuery)
export class getUserByEmailQueryHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository
  ) {}

  async execute({email}: GetUserByEmailQuery) {
    return this.userRepository.findByEmail(email);
  }
}
