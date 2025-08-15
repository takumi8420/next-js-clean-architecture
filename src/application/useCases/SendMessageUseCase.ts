import { MessageRepository } from '@/domain/repositories/MessageRepository';
import { Message } from '@/domain/entities/Message';
import { ChannelId } from '@/domain/valueObjects/ChannelId';
import { UserId } from '@/domain/valueObjects/UserId';
import { toMessageId } from '@/domain/valueObjects/MessageId';
import { Clock } from '@/domain/time/Clock';

export interface SendMessageInput {
  channelId: ChannelId;
  userId: UserId;
  content: string;
}

export class SendMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: SendMessageInput): Promise<Message> {
    if (!input.content || input.content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    const messageId = toMessageId(`msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    const now = this.clock.now();

    const message = new Message(
      messageId,
      input.channelId,
      input.userId,
      input.content.trim(),
      now,
    );

    await this.messageRepository.save(message);

    return message;
  }
}
