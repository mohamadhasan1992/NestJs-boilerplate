import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { AppModule } from 'src/app.module';
import { Test } from "@nestjs/testing";

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const dbUri = 'mongodb://localhost:27017/test_db';
    await mongoose.connect(dbUri);
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await app.close();
  });

  const user = {
    email: "test@yahoo.com",
    password: "123456@WEek"
  }
  const createUser = async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: user.email, password: user.password })
      .expect(201);
    
    return response.body
  };


  it('should sign up a user', async () => {
    const newUser = await createUser()

    expect(newUser).toEqual({ message: "success.SIGNUPED_SUCCESSFULLY" });
  });

  it('should log in a user', async () => {
    await createUser()
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200);
      
      expect(response.body).toEqual({
        message: expect.any(String),
        token: expect.any(String)
      });
    const cookies = response.headers['set-cookie'] as unknown as Array<string>;

    const authCookie = cookies.find((cookie: string) =>
      cookie.startsWith('Authentication=')
    );
    expect(authCookie).toBeDefined();

    const refreshCookie = cookies.find((cookie: string) =>
      cookie.startsWith('Refresh=')
    );
    expect(refreshCookie).toBeDefined();
    
  });

  it('should log out a user', async () => {
    const agent = request.agent(app.getHttpServer());
    await createUser();

    // Log in the user
    const loginResponse = await agent
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200);

    const { token } = loginResponse.body;

    // logout the user
    const logoutResponse = await agent
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`) 
      .expect(200);

    expect(logoutResponse.body).toEqual({ message: 'success.LOGEDOUT' });

    const updatedCookies = logoutResponse.headers['set-cookie'] as unknown as Array<string>;

    const authCookie = updatedCookies.find((cookie: string) =>
      cookie.startsWith('Authentication=removed')
    );
    expect(authCookie).toBeDefined();

    const refreshCookie = updatedCookies.find((cookie: string) =>
      cookie.startsWith('Refresh=removed')
    );
    expect(refreshCookie).toBeDefined();  


  });

  it('should return user details', async () => {
    const agent = request.agent(app.getHttpServer());
    // Create and sign up the user first
    await createUser();

    // Log in the user
    const loginResponse = await agent
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200);

    const { token } = loginResponse.body;
    // get me
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`) 
      .expect(200);
      
    expect(response.body).toHaveProperty('email', user.email);
  });
});
