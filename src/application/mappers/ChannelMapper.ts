import { Channel } from '@/domain/entities/Channel';
import { ChannelDto } from '@/application/dto/ChannelDto';
import { toChannelId } from '@/domain/valueObjects/ChannelId';

export class ChannelMapper {
  static toDto(channel: Channel): ChannelDto {
    return {
      id: channel.id,
      name: channel.name,
      description: channel.description,
      isPrivate: channel.isPrivate,
      createdAt: channel.createdAt.toISOString(),
    };
  }

  static toDomain(dto: ChannelDto): Channel {
    return new Channel(
      toChannelId(dto.id),
      dto.name,
      dto.description,
      dto.isPrivate,
      new Date(dto.createdAt),
    );
  }

  static toDtoArray(channels: Channel[]): ChannelDto[] {
    return channels.map((channel) => this.toDto(channel));
  }
}