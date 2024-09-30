import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SignUpCommand } from '../../impl/auth/signup.command'; 
import { IUserRepository, IUserEntityFactory } from 'shared/adapters';
import { EventPublisher } from '@nestjs/cqrs';
import { SignupCommandHandler } from './signup-command.handler';

describe('SignupCommandHandler', () => {
  let handler: SignupCommandHandler;
  let userRepository: IUserRepository;
  let userFactory: IUserEntityFactory;
  let eventPublisher: EventPublisher;

  const mockUserRepository = {
    findByEmail: jest.fn(),
  };

  const mockUserFactory = {
    create: jest.fn(),
  };

  const mockEventPublisher = {
    mergeObjectContext: jest.fn().mockReturnValue({
      commit: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignupCommandHandler,
        { provide: 'UserRepository', useValue: mockUserRepository },
        { provide: 'UserEntityFactory', useValue: mockUserFactory },
        { provide: EventPublisher, useValue: mockEventPublisher },
      ],
    }).compile();

    handler = module.get<SignupCommandHandler>(SignupCommandHandler);
    userRepository = module.get<IUserRepository>('UserRepository');
    userFactory = module.get<IUserEntityFactory>('UserEntityFactory');
    eventPublisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should throw an error if the user already exists', async () => {
    const signUpUserDto = { email: 'test@example.com', password: 'password123' };
    const command = new SignUpCommand(signUpUserDto);


    mockUserRepository.findByEmail.mockResolvedValueOnce({ email: 'test@example.com' });
    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
    mockUserRepository.findByEmail.mockResolvedValueOnce({ email: 'test@example.com' });
    await expect(handler.execute(command)).rejects.toThrow('error.USER_ALREADY_EXISTS');

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(signUpUserDto.email);
  });

  it('should create a new user if the user does not exist', async () => {
    const signUpUserDto = { email: 'test@example.com', password: 'password123' };
    const command = new SignUpCommand(signUpUserDto);

    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    
    const newUser = { email: 'test@example.com', password: 'password123' };
    mockUserFactory.create.mockResolvedValueOnce(newUser);

    const result = await handler.execute(command);

    expect(result).toEqual({
      message: "success.SIGNUPED_SUCCESSFULLY",
    });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(signUpUserDto.email);
    expect(mockUserFactory.create).toHaveBeenCalledWith(signUpUserDto.email, signUpUserDto.password);
    expect(mockEventPublisher.mergeObjectContext).toHaveBeenCalledWith(newUser);
  });
});
