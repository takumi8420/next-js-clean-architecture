import { IMessageRepository } from '@/domain/repositories/MessageRepository';
import { Message } from '@/domain/entities/Message';
import { MessageId, toMessageId } from '@/domain/valueObjects/MessageId';
import { ChannelId } from '@/domain/valueObjects/ChannelId';
import { toUserId } from '@/domain/valueObjects/UserId';
import { MessageDto } from '@/application/dto/MessageDto';

export class HttpMessageRepository implements IMessageRepository {
  constructor(private readonly apiBaseUrl: string) {}

  async findById(id: MessageId): Promise<Message | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/messages/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch message: ${response.statusText}`);
      }

      const dto: MessageDto = await response.json();
      return new Message(
        toMessageId(dto.id),
        dto.channelId as ChannelId,
        toUserId(dto.userId),
        dto.content,
        new Date(dto.timestamp),
      );
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  }

  async findByChannelId(channelId: ChannelId): Promise<Message[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/channels/${channelId}/messages`);
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const dtos: MessageDto[] = await response.json();
      return dtos.map(
        (dto) =>
          new Message(
            toMessageId(dto.id),
            dto.channelId as ChannelId,
            toUserId(dto.userId),
            dto.content,
            new Date(dto.timestamp),
          ),
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async save(message: Message): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: message.id,
          channelId: message.channelId,
          userId: message.userId,
          content: message.content,
          timestamp: message.createdAt.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save message: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  async update(message: Message): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/messages/${message.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message.content,
          updatedAt: message.updatedAt?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update message: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }
}
