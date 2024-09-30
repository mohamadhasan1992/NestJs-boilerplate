import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LoginCommand } from '../../impl/auth/login.command';
import { IJwtService, IBcryptService, IUserRepository, JWTConfig } from 'shared/adapters';
import { loginCommandHandler } from './login-command.handler';

describe('LoginCommandHandler', () => {
  let handler: loginCommandHandler;
  let userRepository: IUserRepository;
  let jwtTokenService: IJwtService;
  let jwtConfig: JWTConfig;
  let bcryptService: IBcryptService;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    updateRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    createToken: jest.fn(),
  };

  const mockJwtConfig = {
    getJwtSecret: jest.fn().mockReturnValue('secret'),
    getJwtExpirationTime: jest.fn().mockReturnValue(3600),
    getJwtRefreshSecret: jest.fn().mockReturnValue('refresh_secret'),
    getJwtRefreshExpirationTime: jest.fn().mockReturnValue(86400),
  };

  const mockBcryptService = {
    hash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        loginCommandHandler,
        { provide: 'UserRepository', useValue: mockUserRepository },
        { provide: 'JwtService', useValue: mockJwtService },
        { provide: 'JwtConfig', useValue: mockJwtConfig },
        { provide: 'BcryptService', useValue: mockBcryptService },
      ],
    }).compile();

    handler = module.get<loginCommandHandler>(loginCommandHandler);
    userRepository = module.get<IUserRepository>('UserRepository');
    jwtTokenService = module.get<IJwtService>('JwtService');
    jwtConfig = module.get<JWTConfig>('JwtConfig');
    bcryptService = module.get<IBcryptService>('BcryptService');
  });

  it('should login a user successfully', async () => {
    const loginUserDto = { email: 'test@example.com', password: 'password123' };
    const command = new LoginCommand(loginUserDto);

    // Mock user retrieval
    const mockUser = {
      getId: jest.fn().mockReturnValue('user-id-123'),
      getPassword: jest.fn().mockReturnValue('hashed-password'),
    };
    mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);
    
    // Mock token creation
    mockJwtService.createToken.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');
    
    // Mock hashing
    mockBcryptService.hash.mockResolvedValueOnce('hashed-refresh-token');

    const result = await handler.execute(command);

    expect(result).toEqual({
      accessTokenCookie: 'access-token',
      refreshTokenCookie: 'refresh-token',
    });

    // Verify method calls
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginUserDto.email);
    expect(mockJwtService.createToken).toHaveBeenCalledTimes(2);
    expect(mockBcryptService.hash).toHaveBeenCalledWith('refresh-token');
    expect(mockUserRepository.updateRefreshToken).toHaveBeenCalledWith('user-id-123', 'hashed-refresh-token');
  });

  it('should throw an error if the user does not exist', async () => {
    const loginUserDto = { email: 'nonexistent@example.com', password: 'password123' };
    const command = new LoginCommand(loginUserDto);

    // Mock user retrieval to return null
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    await expect(handler.execute(command)).rejects.toThrow('error.USER_NOT_FOUND'); // Adjust message as per your implementation
  });

});
