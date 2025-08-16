import { inject, injectable } from 'inversify';
import { IMessageRepository } from '@/domain/repositories/MessageRepository';
import { Message } from '@/domain/entities/Message';
import { toChannelId } from '@/domain/valueObjects/ChannelId';
import { toUserId } from '@/domain/valueObjects/UserId';
import { toMessageId } from '@/domain/valueObjects/MessageId';
import { Clock } from '@/domain/time/Clock';
import { ValidationError } from '@/domain/errors/ValidationError';
import { MessageDto } from '@/application/dto/MessageDto';
import { SendMessageInputDto } from '@/application/dto/SendMessageInputDto';
import { MessageMapper } from '@/application/mappers/MessageMapper';
import { TYPES } from '@/di/types';

@injectable()
export class SendMessageUseCase {
  constructor(
    @inject(TYPES.MessageRepository) private readonly messageRepository: IMessageRepository,
    @inject(TYPES.Clock) private readonly clock: Clock,
  ) {}

  async execute(input: SendMessageInputDto): Promise<MessageDto> {
    if (!input.content || input.content.trim().length === 0) {
      throw new ValidationError('content', 'Message content cannot be empty');
    }

    const messageId = toMessageId(`msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    const now = this.clock.now();

    const message = new Message(
      messageId,
      toChannelId(input.channelId),
      toUserId(input.userId),
      input.content.trim(),
      now,
    );

    await this.messageRepository.save(message);

    return MessageMapper.toDto(message);
  }
}
