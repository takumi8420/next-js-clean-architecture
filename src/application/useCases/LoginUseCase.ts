import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { AuthService, AuthCredentials } from '@/domain/services/AuthService';
import { UserDto } from '@/application/dto/UserDto';
import { UserMapper } from '@/application/mappers/UserMapper';

export interface LoginUseCaseInput {
  email: string;
  password: string;
}

export interface LoginUseCaseOutput {
  user: UserDto;
  token: string;
  expiresAt: Date;
}

@injectable()
export class LoginUseCase {
  constructor(@inject(TYPES.AuthService) private readonly authService: AuthService) {}

  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    const credentials: AuthCredentials = {
      email: input.email,
      password: input.password,
    };

    const { user, token } = await this.authService.login(credentials);

    return {
      user: UserMapper.toDto(user),
      token: token.token,
      expiresAt: token.expiresAt,
    };
  }
}
