import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { AuthService } from '@/domain/services/AuthService';
import { UserDto } from '@/application/dto/UserDto';
import { UserMapper } from '@/application/mappers/UserMapper';

export interface ValidateTokenUseCaseInput {
  token: string;
}

export interface ValidateTokenUseCaseOutput {
  user: UserDto | null;
}

@injectable()
export class ValidateTokenUseCase {
  constructor(@inject(TYPES.AuthService) private readonly authService: AuthService) {}

  async execute(input: ValidateTokenUseCaseInput): Promise<ValidateTokenUseCaseOutput> {
    const user = await this.authService.validateToken(input.token);

    return {
      user: user ? UserMapper.toDto(user) : null,
    };
  }
}
