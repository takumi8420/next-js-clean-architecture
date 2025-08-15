import { Channel } from '../entities/Channel';
import { ChannelId } from '../valueObjects/ChannelId';

export interface ChannelRepository {
  findById(id: ChannelId): Promise<Channel | null>;
  findAll(): Promise<Channel[]>;
  findPublicChannels(): Promise<Channel[]>;
}
