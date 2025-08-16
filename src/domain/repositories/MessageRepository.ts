import { Message } from '../entities/Message';
import { MessageId } from '../valueObjects/MessageId';
import { ChannelId } from '../valueObjects/ChannelId';

export interface IMessageRepository {
  findById(id: MessageId): Promise<Message | null>;
  findByChannelId(channelId: ChannelId): Promise<Message[]>;
  save(message: Message): Promise<void>;
  update(message: Message): Promise<void>;
}
