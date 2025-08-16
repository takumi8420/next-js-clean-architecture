import { inject, injectable } from 'inversify';
import { IChannelRepository } from '@/domain/repositories/ChannelRepository';
import { ChannelDto } from '@/application/dto/ChannelDto';
import { ChannelMapper } from '@/application/mappers/ChannelMapper';
import { TYPES } from '@/di/types';

@injectable()
export class GetChannelsUseCase {
  constructor(
    @inject(TYPES.ChannelRepository) private readonly channelRepository: IChannelRepository,
  ) {}

  async execute(): Promise<ChannelDto[]> {
    const channels = await this.channelRepository.findAll();
    return ChannelMapper.toDtoArray(channels);
  }
}
