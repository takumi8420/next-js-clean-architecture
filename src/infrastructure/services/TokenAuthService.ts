import * as crypto from 'crypto';

import { inject, injectable } from 'inversify';

import { AuthService, AuthToken, AuthCredentials } from '@/domain/services/AuthService';
import { User } from '@/domain/entities/User';
import type { IUserRepository } from '@/domain/repositories/UserRepository';
import { UserId } from '@/domain/valueObjects/UserId';
import { TYPES } from '@/di/types';

@injectable()
export class TokenAuthService implements AuthService {
  private readonly tokenStore = new Map<string, { userId: string; expiresAt: Date }>();

  constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

  async login(credentials: AuthCredentials): Promise<{ user: User; token: AuthToken }> {
    // 実際の実装では、パスワードのハッシュ化と検証を行う必要があります
    const users = await this.userRepository.findAll();
    const user = users.find((u) => u.email.value === credentials.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // TODO: パスワード検証の実装
    // 現在は仮実装として、パスワードが 'password' の場合のみ認証成功とします
    if (credentials.password !== 'password') {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後

    this.tokenStore.set(token, { userId: user.id, expiresAt });

    return {
      user,
      token: { token, expiresAt },
    };
  }

  async logout(token: string): Promise<void> {
    this.tokenStore.delete(token);
  }

  async validateToken(token: string): Promise<User | null> {
    const tokenData = this.tokenStore.get(token);

    if (!tokenData) {
      return null;
    }

    if (tokenData.expiresAt < new Date()) {
      this.tokenStore.delete(token);
      return null;
    }

    return this.userRepository.findById(tokenData.userId as UserId);
  }

  async refreshToken(token: string): Promise<AuthToken> {
    const user = await this.validateToken(token);

    if (!user) {
      throw new Error('Invalid token');
    }

    // 古いトークンを削除
    this.tokenStore.delete(token);

    // 新しいトークンを生成
    const newToken = this.generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後

    this.tokenStore.set(newToken, { userId: user.id, expiresAt });

    return { token: newToken, expiresAt };
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
