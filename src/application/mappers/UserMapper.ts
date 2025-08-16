import { User, UserStatus } from '@/domain/entities/User';
import { UserDto } from '@/application/dto/UserDto';
import { toUserId } from '@/domain/valueObjects/UserId';
import { Email } from '@/domain/valueObjects/Email';

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email.toString(),
      name: user.name,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    };
  }

  static toDomain(dto: UserDto): User {
    return new User(
      toUserId(dto.id),
      new Email(dto.email),
      dto.name,
      dto.status as UserStatus,
      new Date(dto.createdAt),
    );
  }
}
