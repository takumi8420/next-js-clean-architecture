import { IChannelRepository } from '@/domain/repositories/ChannelRepository';
import { Channel } from '@/domain/entities/Channel';
import { ChannelId, toChannelId } from '@/domain/valueObjects/ChannelId';
import { PrismaClient } from '@prisma/client';

export class PrismaChannelRepository implements IChannelRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: ChannelId): Promise<Channel | null> {
    const row = await this.prisma.channel.findUnique({ where: { id } });
    if (!row) return null;
    return new Channel(
      toChannelId(row.id), 
      row.name, 
      row.description || '', 
      false, // isPrivate - デフォルトはfalse
      row.createdAt
    );
  }

  async findAll(): Promise<Channel[]> {
    const rows = await this.prisma.channel.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(row => new Channel(
      toChannelId(row.id), 
      row.name, 
      row.description || '',
      false, // isPrivate - デフォルトはfalse
      row.createdAt
    ));
  }

  async findPublicChannels(): Promise<Channel[]> {
    // 現在のスキーマにはisPrivateフィールドがないため、すべてのチャンネルを返す
    return this.findAll();
  }
}