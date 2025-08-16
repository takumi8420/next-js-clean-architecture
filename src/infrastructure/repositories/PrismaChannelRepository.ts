import { PrismaClient } from '@prisma/client';

import { Channel } from '@/domain/entities/Channel';
import { IChannelRepository } from '@/domain/repositories/ChannelRepository';
import { ChannelId, toChannelId } from '@/domain/valueObjects/ChannelId';

export class PrismaChannelRepository implements IChannelRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: ChannelId): Promise<Channel | null> {
    const row = await this.prisma.channel.findUnique({ where: { id } });
    if (!row) return null;
    return new Channel(
      toChannelId(row.id),
      row.name,
      row.description || '',
      row.isPrivate,
      row.createdAt,
    );
  }

  async findAll(): Promise<Channel[]> {
    const rows = await this.prisma.channel.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(
      (row) =>
        new Channel(
          toChannelId(row.id),
          row.name,
          row.description || '',
          row.isPrivate,
          row.createdAt,
        ),
    );
  }

  async findPublicChannels(): Promise<Channel[]> {
    const rows = await this.prisma.channel.findMany({
      where: { isPrivate: false },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(
      (row) =>
        new Channel(
          toChannelId(row.id),
          row.name,
          row.description || '',
          row.isPrivate,
          row.createdAt,
        ),
    );
  }
}
