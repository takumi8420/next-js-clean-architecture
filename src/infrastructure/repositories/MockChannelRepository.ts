import { IChannelRepository } from '@/domain/repositories/ChannelRepository';
import { Channel } from '@/domain/entities/Channel';
import { ChannelId, toChannelId } from '@/domain/valueObjects/ChannelId';
import { mockChannels } from '@/mock/data';

export class MockChannelRepository implements IChannelRepository {
  private channels: Channel[];

  constructor() {
    this.channels = mockChannels.map(
      (channel) =>
        new Channel(
          toChannelId(channel.id),
          channel.name,
          channel.description,
          channel.isPrivate,
          new Date(channel.createdAt),
        ),
    );
  }

  async findById(id: ChannelId): Promise<Channel | null> {
    const channel = this.channels.find((c) => c.id === id);
    return channel || null;
  }

  async findAll(): Promise<Channel[]> {
    return [...this.channels];
  }

  async findPublicChannels(): Promise<Channel[]> {
    return this.channels.filter((c) => !c.isPrivate);
  }
}
