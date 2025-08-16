import { PrismaClient } from '@prisma/client';

import { User, UserStatus } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/repositories/UserRepository';
import { Email } from '@/domain/valueObjects/Email';
import { UserId, toUserId } from '@/domain/valueObjects/UserId';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: UserId): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    if (!row) return null;
    return new User(
      toUserId(row.id),
      new Email(row.email),
      row.name,
      row.status as UserStatus,
      row.createdAt,
    );
  }

  async findByEmail(email: Email): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email: email.toString() } });
    if (!row) return null;
    return new User(
      toUserId(row.id),
      new Email(row.email),
      row.name,
      row.status as UserStatus,
      row.createdAt,
    );
  }

  async findAll(): Promise<User[]> {
    const rows = await this.prisma.user.findMany();
    return rows.map(
      (row) =>
        new User(
          toUserId(row.id),
          new Email(row.email),
          row.name,
          row.status as UserStatus,
          row.createdAt,
        ),
    );
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        status: user.status,
        updatedAt: new Date(),
      },
      create: {
        id: user.id,
        email: user.email.toString(),
        name: user.name,
        status: user.status,
      },
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
