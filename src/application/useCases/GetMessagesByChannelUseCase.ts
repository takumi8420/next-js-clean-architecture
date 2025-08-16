import { IMessageRepository } from '@/domain/repositories/MessageRepository';
import { IUserRepository } from '@/domain/repositories/UserRepository';
import { Message } from '@/domain/entities/Message';
import { User } from '@/domain/entities/User';
import { ChannelId } from '@/domain/valueObjects/ChannelId';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import { MessageWithUserDto } from '@/application/dto/MessageWithUserDto';
import { MessageMapper } from '@/application/mappers/MessageMapper';

export interface MessageWithUser {
  message: Message;
  user: User;
}

export class GetMessagesByChannelUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(channelId: ChannelId): Promise<MessageWithUserDto[]> {
    const messages = await this.messageRepository.findByChannelId(channelId);

    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const user = await this.userRepository.findById(message.userId);
        if (!user) {
          throw new NotFoundError(`User (${message.userId})`);
        }
        return { message, user };
      }),
    );

    return MessageMapper.toMessageWithUserDtoArray(messagesWithUsers);
  }
}
