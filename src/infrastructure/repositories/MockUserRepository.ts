import { IUserRepository } from '@/domain/repositories/UserRepository';
import { User } from '@/domain/entities/User';
import { UserId, toUserId } from '@/domain/valueObjects/UserId';
import { Email } from '@/domain/valueObjects/Email';
import { mockUsers } from '@/mock/data';

export class MockUserRepository implements IUserRepository {
  private users: User[];

  constructor() {
    this.users = mockUsers.map(
      (user) =>
        new User(
          toUserId(user.id),
          new Email(user.email),
          user.name,
          user.status,
          new Date(), // Mock用に現在時刻を設定
        ),
    );
  }

  async findById(id: UserId): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = this.users.find((u) => u.email.toString() === email.toString());
    return user || null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async save(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      // 既存のユーザーを更新
      this.users[index] = user;
    } else {
      // 新規ユーザーを追加
      this.users.push(user);
    }
  }

  async delete(id: UserId): Promise<void> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }
}
