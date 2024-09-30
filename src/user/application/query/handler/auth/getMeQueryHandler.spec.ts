import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetMeQuery } from '../../impl/auth/get-me-query';
import { IUserRepository } from 'shared/adapters';
import { getMeQueryHandler } from './get-me-query.handler';

describe('GetMeQueryHandler', () => {
  let handler: getMeQueryHandler;
  let userRepository: IUserRepository;

  const mockUserRepository = {
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        getMeQueryHandler,
        { provide: 'UserRepository', useValue: mockUserRepository },
      ],
    }).compile();

    handler = module.get<getMeQueryHandler>(getMeQueryHandler);
    userRepository = module.get<IUserRepository>('UserRepository');
  });

  it('should return user details when user is found', async () => {
    const userId = 'user-id-123';
    const query = new GetMeQuery(userId);

    const mockUser = {
      getId: jest.fn().mockReturnValue(userId),
      getEmail: jest.fn().mockReturnValue('test@example.com'),
      getTodoLists: jest.fn().mockReturnValue([{ title: 'Sample Todo' }]),
    };
    mockUserRepository.findOneById.mockResolvedValueOnce(mockUser);

    const result = await handler.execute(query);

    expect(result).toEqual({
      _id: userId,
      email: 'test@example.com',
      TodoLists: [{ title: 'Sample Todo' }],
    });

    // Verify method call
    expect(mockUserRepository.findOneById).toHaveBeenCalledWith(userId, [
      {
        path: 'TodoLists',
        model: 'TodoList',
        select: ['title'],
        options: {
          skip: 0,
          limit: 10,
        },
      },
    ]);
  });

  it('should throw NotFoundException when user is not found', async () => {
    const userId = 'not-found-user-id';
    const query = new GetMeQuery(userId);

    // Mock user retrieval to return null
    mockUserRepository.findOneById.mockResolvedValueOnce(null);

    await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
    await expect(handler.execute(query)).rejects.toThrow('error.USER_NOT_FOUND');
  });
});
