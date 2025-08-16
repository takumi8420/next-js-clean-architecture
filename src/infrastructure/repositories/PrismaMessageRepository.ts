import { IMessageRepository } from '@/domain/repositories/MessageRepository';
import { Message } from '@/domain/entities/Message';
import { MessageId } from '@/domain/valueObjects/MessageId';
import { ChannelId } from '@/domain/valueObjects/ChannelId';
import { toMessageId } from '@/domain/valueObjects/MessageId';
import { toUserId } from '@/domain/valueObjects/UserId';
import { toChannelId } from '@/domain/valueObjects/ChannelId';
import { PrismaClient } from '@prisma/client';

export class PrismaMessageRepository implements IMessageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: MessageId): Promise<Message | null> {
    const row = await this.prisma.message.findUnique({ where: { id } });
    if (!row) return null;
    return new Message(
      toMessageId(row.id),
      toChannelId(row.channelId),
      toUserId(row.userId),
      row.content,
      row.timestamp,
    );
  }

  async findByChannelId(channelId: ChannelId): Promise<Message[]> {
    const rows = await this.prisma.message.findMany({
      where: { channelId },
      orderBy: { timestamp: 'asc' },
    });
    return rows.map(row =>
      new Message(
        toMessageId(row.id),
        toChannelId(row.channelId),
        toUserId(row.userId),
        row.content,
        row.timestamp,
      ),
    );
  }

  async save(message: Message): Promise<void> {
    await this.prisma.message.create({
      data: {
        id: message.id,
        content: message.content,
        userId: message.userId,
        channelId: message.channelId,
        timestamp: message.createdAt,
      },
    });
  }

  async update(message: Message): Promise<void> {
    await this.prisma.message.update({
      where: { id: message.id },
      data: {
        content: message.content,
        // updatedAtがないため、timestampは更新しない
      },
    });
  }
}