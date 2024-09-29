import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMeQuery } from '../../impl/auth/get-me-query';
import { IUserRepository } from 'src/shared/adapters';




@QueryHandler(GetMeQuery)
export class getMeQueryHandler implements IQueryHandler<GetMeQuery> {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository
  ) {}

  async execute({userId}: GetMeQuery) {
    return this.userRepository.findOneById(userId);
  }
}
