import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UserEntityRepository } from 'src/infrustructure/repositories/user-entity.repository';
import { GetMeQuery } from '../../impl/auth/get-me-query';




@QueryHandler(GetMeQuery)
export class getMeQueryHandler implements IQueryHandler<GetMeQuery> {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: UserEntityRepository
  ) {}

  async execute({userId}: GetMeQuery) {
    return this.userRepository.findOneById(userId);
  }
}
