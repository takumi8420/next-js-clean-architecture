import { IMessageRepository } from '@/domain/repositories/MessageRepository';
import { Clock } from '@/domain/time/Clock';
import { toChannelId } from '@/domain/valueObjects/ChannelId';
import { toUserId } from '@/domain/valueObjects/UserId';
import { SendMessageUseCase } from '@/application/useCases/SendMessageUseCase';

describe('SendMessageUseCase', () => {
  let mockMessageRepository: jest.Mocked<IMessageRepository>;
  let mockClock: jest.Mocked<Clock>;
  let useCase: SendMessageUseCase;

  beforeEach(() => {
    mockMessageRepository = {
      findById: jest.fn(),
      findByChannelId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    mockClock = {
      now: jest.fn(),
    };

    useCase = new SendMessageUseCase(mockMessageRepository, mockClock);
  });

  describe('execute', () => {
    it('should create and save a new message', async () => {
      const now = new Date('2024-01-01T10:00:00');
      mockClock.now.mockReturnValue(now);

      const input = {
        channelId: toChannelId('channel-1'),
        userId: toUserId('user-1'),
        content: 'Hello, world!',
      };

      mockMessageRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(input);

      expect(result.channelId).toBe(input.channelId);
      expect(result.userId).toBe(input.userId);
      expect(result.content).toBe('Hello, world!');
      expect(result.timestamp).toBe(now.toISOString());

      expect(mockMessageRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          channelId: input.channelId,
          userId: input.userId,
          content: 'Hello, world!',
        }),
      );
      expect(mockClock.now).toHaveBeenCalledTimes(1);
    });

    it('should trim content before saving', async () => {
      const now = new Date('2024-01-01T10:00:00');
      mockClock.now.mockReturnValue(now);

      const input = {
        channelId: toChannelId('channel-1'),
        userId: toUserId('user-1'),
        content: '  Hello, world!  ',
      };

      mockMessageRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(input);

      expect(result.content).toBe('Hello, world!');
    });

    it('should throw error for empty content', async () => {
      const input = {
        channelId: toChannelId('channel-1'),
        userId: toUserId('user-1'),
        content: '',
      };

      await expect(useCase.execute(input)).rejects.toThrow('Message content cannot be empty');
      expect(mockMessageRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for whitespace only content', async () => {
      const input = {
        channelId: toChannelId('channel-1'),
        userId: toUserId('user-1'),
        content: '   ',
      };

      await expect(useCase.execute(input)).rejects.toThrow('Message content cannot be empty');
      expect(mockMessageRepository.save).not.toHaveBeenCalled();
    });

    it('should generate unique message IDs', async () => {
      const now = new Date('2024-01-01T10:00:00');
      mockClock.now.mockReturnValue(now);
      mockMessageRepository.save.mockResolvedValue(undefined);

      const input = {
        channelId: toChannelId('channel-1'),
        userId: toUserId('user-1'),
        content: 'Test message',
      };

      const result1 = await useCase.execute(input);
      const result2 = await useCase.execute(input);

      expect(result1.id).not.toBe(result2.id);
    });

    it('should handle repository errors', async () => {
      const now = new Date('2024-01-01T10:00:00');
      mockClock.now.mockReturnValue(now);

      const input = {
        channelId: toChannelId('channel-1'),
        userId: toUserId('user-1'),
        content: 'Hello, world!',
      };

      const error = new Error('Repository error');
      mockMessageRepository.save.mockRejectedValue(error);

      await expect(useCase.execute(input)).rejects.toThrow('Repository error');
    });
  });
});
