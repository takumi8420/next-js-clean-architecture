import { MessageRepository } from '@/domain/repositories/MessageRepository';
import { UserRepository } from '@/domain/repositories/UserRepository';
import { Message } from '@/domain/entities/Message';
import { User } from '@/domain/entities/User';
import { ChannelId } from '@/domain/valueObjects/ChannelId';

export interface MessageWithUser {
  message: Message;
  user: User;
}

export class GetMessagesByChannelUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(channelId: ChannelId): Promise<MessageWithUser[]> {
    const messages = await this.messageRepository.findByChannelId(channelId);

    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const user = await this.userRepository.findById(message.userId);
        if (!user) {
          throw new Error(`User not found: ${message.userId}`);
        }
        return { message, user };
      }),
    );

    return messagesWithUsers;
  }
}
