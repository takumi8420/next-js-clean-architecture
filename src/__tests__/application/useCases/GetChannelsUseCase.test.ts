import { GetChannelsUseCase } from '@/application/useCases/GetChannelsUseCase';
import { IChannelRepository } from '@/domain/repositories/ChannelRepository';
import { Channel } from '@/domain/entities/Channel';
import { toChannelId } from '@/domain/valueObjects/ChannelId';

describe('GetChannelsUseCase', () => {
  let mockChannelRepository: jest.Mocked<IChannelRepository>;
  let useCase: GetChannelsUseCase;

  beforeEach(() => {
    mockChannelRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findPublicChannels: jest.fn(),
    };
    useCase = new GetChannelsUseCase(mockChannelRepository);
  });

  describe('execute', () => {
    it('should return all channels', async () => {
      const channels = [
        new Channel(
          toChannelId('channel-1'),
          'general',
          'General discussion',
          false,
          new Date('2024-01-01'),
        ),
        new Channel(
          toChannelId('channel-2'),
          'random',
          'Random chat',
          false,
          new Date('2024-01-01'),
        ),
      ];

      mockChannelRepository.findAll.mockResolvedValue(channels);

      const result = await useCase.execute();

      expect(result).toEqual(channels);
      expect(mockChannelRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no channels exist', async () => {
      mockChannelRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(mockChannelRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Repository error');
      mockChannelRepository.findAll.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow('Repository error');
    });
  });
});
