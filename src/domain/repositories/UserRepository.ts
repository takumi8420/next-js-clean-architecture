import { User } from '../entities/User';
import { UserId } from '../valueObjects/UserId';
import { Email } from '../valueObjects/Email';

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
