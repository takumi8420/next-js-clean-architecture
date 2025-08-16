import { IUserRepository } from '@/domain/repositories/UserRepository';
import { User } from '@/domain/entities/User';
import { UserId, toUserId } from '@/domain/valueObjects/UserId';
import { Email } from '@/domain/valueObjects/Email';
import { UserDto } from '@/application/dto/UserDto';

export class HttpUserRepository implements IUserRepository {
  constructor(private readonly apiBaseUrl: string) {}

  async findById(id: UserId): Promise<User | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const dto: UserDto = await response.json();
      return new User(
        toUserId(dto.id),
        new Email(dto.email),
        dto.name,
        dto.status as 'online' | 'away' | 'offline',
        new Date(dto.createdAt),
      );
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async findByEmail(email: Email): Promise<User | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users?email=${email.value}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user by email: ${response.statusText}`);
      }

      const dtos: UserDto[] = await response.json();
      if (dtos.length === 0) return null;

      const dto = dtos[0];
      return new User(
        toUserId(dto.id),
        new Email(dto.email),
        dto.name,
        dto.status as 'online' | 'away' | 'offline',
        new Date(dto.createdAt),
      );
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const dtos: UserDto[] = await response.json();
      return dtos.map(
        (dto) =>
          new User(
            toUserId(dto.id),
            new Email(dto.email),
            dto.name,
            dto.status as 'online' | 'away' | 'offline',
            new Date(dto.createdAt),
          ),
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async save(user: User): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email.value,
          name: user.name,
          status: user.status,
          createdAt: user.createdAt.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async delete(id: UserId): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
