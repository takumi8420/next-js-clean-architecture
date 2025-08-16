import { User } from '@/domain/entities/User';

export interface AuthToken {
  readonly token: string;
  readonly expiresAt: Date;
}

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

export interface AuthService {
  login(credentials: AuthCredentials): Promise<{ user: User; token: AuthToken }>;
  logout(token: string): Promise<void>;
  validateToken(token: string): Promise<User | null>;
  refreshToken(token: string): Promise<AuthToken>;
}
