import { Message } from '@/domain/entities/Message';
import { MessageDto } from '@/application/dto/MessageDto';
import { MessageWithUserDto } from '@/application/dto/MessageWithUserDto';
import { toMessageId } from '@/domain/valueObjects/MessageId';
import { toUserId } from '@/domain/valueObjects/UserId';
import { toChannelId } from '@/domain/valueObjects/ChannelId';
import { MessageWithUser } from '@/application/useCases/GetMessagesByChannelUseCase';
import { UserMapper } from './UserMapper';

export class MessageMapper {
  static toDto(message: Message): MessageDto {
    return {
      id: message.id,
      content: message.content,
      userId: message.userId,
      channelId: message.channelId,
      timestamp: message.createdAt.toISOString(),
    };
  }

  static toDomain(dto: MessageDto): Message {
    return new Message(
      toMessageId(dto.id),
      toChannelId(dto.channelId),
      toUserId(dto.userId),
      dto.content,
      new Date(dto.timestamp),
    );
  }

  static toMessageWithUserDto(data: MessageWithUser): MessageWithUserDto {
    return {
      message: this.toDto(data.message),
      user: UserMapper.toDto(data.user),
    };
  }

  static toMessageWithUserDtoArray(data: MessageWithUser[]): MessageWithUserDto[] {
    return data.map((item) => this.toMessageWithUserDto(item));
  }
}
