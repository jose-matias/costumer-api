import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(async () => {
    process.env = {
      KEYCLOAK_BASE_URL: 'base_url',
      KEYCLOAK_REALM: 'realm',
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        HttpModule,
      ],
      providers: [
        AuthGuard,
        AuthService,
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('Should be defined', () => {
    expect(authGuard).toBeDefined();
  });
});
