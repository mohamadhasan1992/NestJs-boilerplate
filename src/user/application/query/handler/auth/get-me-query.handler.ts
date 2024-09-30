import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetMeQuery } from '../../impl/auth/get-me-query';
import { IUserRepository } from 'src/shared/adapters';




@QueryHandler(GetMeQuery)
export class getMeQueryHandler implements IQueryHandler<GetMeQuery> {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: IUserRepository
  ) {}

  async execute({userId}: GetMeQuery) {
    const user = await this.userRepository.findOneById(
      userId, 
      [
        {
          path: "TodoLists",
          model: "TodoList",
          select: ["title"],
          options: {
            skip: 0,
            limit: 10,
          },
        }
      ]
    );
    if(!user){
      throw new NotFoundException("error.USER_NOT_FOUND")
    }else{
      return {
        _id: user.getId(),
        email: user.getEmail(),
        TodoLists: user.getTodoLists()
      }
    }
  }
}
