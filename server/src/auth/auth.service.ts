import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { loadFeatureFlags, type FeatureFlags } from '../config/features';
import { LoginDto } from './dto/login.dto';
import { AuthUserPayload, LoginResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private readonly features: FeatureFlags = loadFeatureFlags();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!this.features.authEnabled || this.features.authMode !== 'database') {
      return;
    }

    try {
      await this.seedAdminUser();
    } catch (error) {
      this.logger.warn(
        `Admin seed skipped — database may be unavailable: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  getStatus() {
    return {
      authEnabled: this.features.authEnabled,
      authMode: this.features.authMode,
      socketAuthEnabled: this.features.socketAuthEnabled,
    };
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    if (!this.features.authEnabled) {
      throw new ServiceUnavailableException('Authentication API is disabled');
    }

    const user = await this.validateCredentials(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { accessToken, user };
  }

  async getProfile(userId: string): Promise<AuthUserPayload> {
    if (this.features.authMode === 'database') {
      const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }

    if (userId === 'mock-admin' || userId === 'env-admin') {
      return {
        id: userId,
        email: this.features.seedEmail,
        name: this.features.seedName,
        role: 'admin',
      };
    }

    throw new UnauthorizedException('User not found');
  }

  verifyToken(token: string): AuthUserPayload {
    try {
      const payload = this.jwtService.verify<{
        sub: string;
        email: string;
        name: string;
        role: string;
      }>(token);

      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async validateCredentials(
    email: string,
    password: string,
  ): Promise<AuthUserPayload | null> {
    switch (this.features.authMode) {
      case 'mock':
        return {
          id: 'mock-admin',
          email,
          name: this.features.seedName,
          role: 'admin',
        };
      case 'env':
        return this.validateEnvCredentials(email, password);
      case 'database':
        return this.validateDatabaseCredentials(email, password);
      default:
        return null;
    }
  }

  private validateEnvCredentials(
    email: string,
    password: string,
  ): AuthUserPayload | null {
    if (
      email !== this.features.seedEmail ||
      password !== this.features.seedPassword
    ) {
      return null;
    }

    return {
      id: 'env-admin',
      email: this.features.seedEmail,
      name: this.features.seedName,
      role: 'admin',
    };
  }

  private async validateDatabaseCredentials(
    email: string,
    password: string,
  ): Promise<AuthUserPayload | null> {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  private async seedAdminUser(): Promise<void> {
    const existing = await this.prisma.adminUser.findUnique({
      where: { email: this.features.seedEmail },
    });

    if (existing) {
      return;
    }

    const hashedPassword = await bcrypt.hash(this.features.seedPassword, 10);

    await this.prisma.adminUser.create({
      data: {
        email: this.features.seedEmail,
        password: hashedPassword,
        name: this.features.seedName,
        role: 'admin',
      },
    });

    this.logger.log(`Seeded admin user: ${this.features.seedEmail}`);
  }
}
