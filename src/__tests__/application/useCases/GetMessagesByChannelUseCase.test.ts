import { Message } from '@/domain/entities/Message';
import { User } from '@/domain/entities/User';
import { IMessageRepository } from '@/domain/repositories/MessageRepository';
import { IUserRepository } from '@/domain/repositories/UserRepository';
import { toMessageId } from '@/domain/valueObjects/MessageId';
import { toChannelId } from '@/domain/valueObjects/ChannelId';
import { toUserId } from '@/domain/valueObjects/UserId';
import { Email } from '@/domain/valueObjects/Email';
import { GetMessagesByChannelUseCase } from '@/application/useCases/GetMessagesByChannelUseCase';

describe('GetMessagesByChannelUseCase', () => {
  let mockMessageRepository: jest.Mocked<IMessageRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let useCase: GetMessagesByChannelUseCase;

  beforeEach(() => {
    mockMessageRepository = {
      findById: jest.fn(),
      findByChannelId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetMessagesByChannelUseCase(mockMessageRepository, mockUserRepository);
  });

  describe('execute', () => {
    it('should return messages with user information', async () => {
      const channelId = toChannelId('channel-1');
      const userId1 = toUserId('user-1');
      const userId2 = toUserId('user-2');

      const messages = [
        new Message(
          toMessageId('msg-1'),
          channelId,
          userId1,
          'Hello',
          new Date('2024-01-01T10:00:00'),
        ),
        new Message(
          toMessageId('msg-2'),
          channelId,
          userId2,
          'Hi there',
          new Date('2024-01-01T10:01:00'),
        ),
      ];

      const user1 = new User(
        userId1,
        new Email('user1@example.com'),
        'User 1',
        'online',
        new Date(),
      );
      const user2 = new User(userId2, new Email('user2@example.com'), 'User 2', 'away', new Date());

      mockMessageRepository.findByChannelId.mockResolvedValue(messages);
      mockUserRepository.findById.mockImplementation(async (id) => {
        if (id === userId1) return user1;
        if (id === userId2) return user2;
        return null;
      });

      const result = await useCase.execute(channelId);

      expect(result).toHaveLength(2);
      expect(result[0].message.id).toBe('msg-1');
      expect(result[0].message.content).toBe('Hello');
      expect(result[0].user.id).toBe('user-1');
      expect(result[1].message.id).toBe('msg-2');
      expect(result[1].message.content).toBe('Hi there');
      expect(result[1].user.id).toBe('user-2');
      expect(mockMessageRepository.findByChannelId).toHaveBeenCalledWith(channelId);
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no messages exist', async () => {
      const channelId = toChannelId('channel-1');
      mockMessageRepository.findByChannelId.mockResolvedValue([]);

      const result = await useCase.execute(channelId);

      expect(result).toEqual([]);
      expect(mockMessageRepository.findByChannelId).toHaveBeenCalledWith(channelId);
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      const channelId = toChannelId('channel-1');
      const userId = toUserId('user-1');

      const messages = [
        new Message(
          toMessageId('msg-1'),
          channelId,
          userId,
          'Hello',
          new Date('2024-01-01T10:00:00'),
        ),
      ];

      mockMessageRepository.findByChannelId.mockResolvedValue(messages);
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(channelId)).rejects.toThrow(`User (${userId}) not found`);
    });

    it('should handle repository errors', async () => {
      const channelId = toChannelId('channel-1');
      const error = new Error('Repository error');
      mockMessageRepository.findByChannelId.mockRejectedValue(error);

      await expect(useCase.execute(channelId)).rejects.toThrow('Repository error');
    });
  });
});
