import { IChannelRepository } from '@/domain/repositories/ChannelRepository';
import { Channel } from '@/domain/entities/Channel';
import { ChannelId, toChannelId } from '@/domain/valueObjects/ChannelId';
import { ChannelDto } from '@/application/dto/ChannelDto';

export class HttpChannelRepository implements IChannelRepository {
  constructor(private readonly apiBaseUrl: string) {}

  async findById(id: ChannelId): Promise<Channel | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/channels/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch channel: ${response.statusText}`);
      }

      const dto: ChannelDto = await response.json();
      return new Channel(
        toChannelId(dto.id),
        dto.name,
        dto.description,
        dto.isPrivate,
        new Date(dto.createdAt),
      );
    } catch (error) {
      console.error('Error fetching channel:', error);
      throw error;
    }
  }

  async findAll(): Promise<Channel[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/channels`);
      if (!response.ok) {
        throw new Error(`Failed to fetch channels: ${response.statusText}`);
      }

      const dtos: ChannelDto[] = await response.json();
      return dtos.map(
        (dto) =>
          new Channel(
            toChannelId(dto.id),
            dto.name,
            dto.description,
            dto.isPrivate,
            new Date(dto.createdAt),
          ),
      );
    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  }

  async findPublicChannels(): Promise<Channel[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/channels?public=true`);
      if (!response.ok) {
        throw new Error(`Failed to fetch public channels: ${response.statusText}`);
      }

      const dtos: ChannelDto[] = await response.json();
      return dtos.map(
        (dto) =>
          new Channel(
            toChannelId(dto.id),
            dto.name,
            dto.description,
            dto.isPrivate,
            new Date(dto.createdAt),
          ),
      );
    } catch (error) {
      console.error('Error fetching public channels:', error);
      throw error;
    }
  }
}
