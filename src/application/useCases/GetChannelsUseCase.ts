import { ChannelRepository } from '@/domain/repositories/ChannelRepository';
import { Channel } from '@/domain/entities/Channel';

export class GetChannelsUseCase {
  constructor(private readonly channelRepository: ChannelRepository) {}

  async execute(): Promise<Channel[]> {
    return await this.channelRepository.findAll();
  }
}
