import { IChannelRepository } from '@/domain/repositories/ChannelRepository';
import { ChannelDto } from '@/application/dto/ChannelDto';
import { ChannelMapper } from '@/application/mappers/ChannelMapper';

export class GetChannelsUseCase {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async execute(): Promise<ChannelDto[]> {
    const channels = await this.channelRepository.findAll();
    return ChannelMapper.toDtoArray(channels);
  }
}
