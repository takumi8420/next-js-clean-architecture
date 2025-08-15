import { MessageRepository } from '@/domain/repositories/MessageRepository';
import { Message } from '@/domain/entities/Message';
import { MessageId, toMessageId } from '@/domain/valueObjects/MessageId';
import { ChannelId, toChannelId } from '@/domain/valueObjects/ChannelId';
import { toUserId } from '@/domain/valueObjects/UserId';
import { mockMessages } from '@/mock/data';

export class MockMessageRepository implements MessageRepository {
  private messages: Message[];

  constructor() {
    this.messages = mockMessages.map(
      (msg) =>
        new Message(
          toMessageId(msg.id),
          toChannelId(msg.channelId),
          toUserId(msg.userId),
          msg.content,
          new Date(msg.createdAt),
        ),
    );
  }

  async findById(id: MessageId): Promise<Message | null> {
    const message = this.messages.find((m) => m.id === id);
    return message || null;
  }

  async findByChannelId(channelId: ChannelId): Promise<Message[]> {
    return this.messages
      .filter((m) => m.channelId === channelId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async save(message: Message): Promise<void> {
    this.messages.push(message);
  }

  async update(message: Message): Promise<void> {
    const index = this.messages.findIndex((m) => m.id === message.id);
    if (index !== -1) {
      this.messages[index] = message;
    }
  }
}
