import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { loadFeatureFlags } from '../../config/features';
import { AuthService } from '../auth.service';
import { AuthUserPayload } from '../dto/auth-response.dto';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    const features = loadFeatureFlags();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: features.jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUserPayload> {
    if (!payload?.sub) {
      throw new UnauthorizedException();
    }

    return this.authService.getProfile(payload.sub);
  }
}
