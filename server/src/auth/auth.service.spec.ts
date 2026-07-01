import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    adminUser: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    process.env.FEATURE_AUTH_ENABLED = 'true';
    process.env.AUTH_MODE = 'env';
    process.env.ADMIN_SEED_EMAIL = 'admin@intracom.com';
    process.env.ADMIN_SEED_PASSWORD = 'changeme';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('signed-token'),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('logs in with env seed credentials', async () => {
    const result = await service.login({
      email: 'admin@intracom.com',
      password: 'changeme',
    });

    expect(result.accessToken).toBe('signed-token');
    expect(result.user.email).toBe('admin@intracom.com');
  });

  it('rejects invalid credentials in env mode', async () => {
    await expect(
      service.login({
        email: 'admin@intracom.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
