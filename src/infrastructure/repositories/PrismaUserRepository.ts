import { IUserRepository } from '@/domain/repositories/UserRepository';
import { User, UserStatus } from '@/domain/entities/User';
import { Email } from '@/domain/valueObjects/Email';
import { UserId, toUserId } from '@/domain/valueObjects/UserId';
import { PrismaClient } from '@prisma/client';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: UserId): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    if (!row) return null;
    return new User(toUserId(row.id), new Email(row.email), row.name, row.status as UserStatus);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email: email.toString() } });
    if (!row) return null;
    return new User(toUserId(row.id), new Email(row.email), row.name, row.status as UserStatus);
  }

  async findAll(): Promise<User[]> {
    const rows = await this.prisma.user.findMany();
    return rows.map(row => new User(toUserId(row.id), new Email(row.email), row.name, row.status as UserStatus));
  }
}