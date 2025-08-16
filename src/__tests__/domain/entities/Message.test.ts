import { Message } from '@/domain/entities/Message';
import { toMessageId } from '@/domain/valueObjects/MessageId';
import { toChannelId } from '@/domain/valueObjects/ChannelId';
import { toUserId } from '@/domain/valueObjects/UserId';
import { ValidationError } from '@/domain/errors/ValidationError';

describe('Message', () => {
  const createMessage = (createdAt: Date = new Date('2024-01-01T10:00:00')) => {
    return new Message(
      toMessageId('msg-1'),
      toChannelId('channel-1'),
      toUserId('user-1'),
      'Hello, world!',
      createdAt,
    );
  };

  describe('constructor', () => {
    it('should create a message with all properties', () => {
      const message = createMessage();

      expect(message.id).toBe('msg-1');
      expect(message.channelId).toBe('channel-1');
      expect(message.userId).toBe('user-1');
      expect(message.content).toBe('Hello, world!');
      expect(message.createdAt).toEqual(new Date('2024-01-01T10:00:00'));
      expect(message.updatedAt).toBeNull();
      expect(message.isEdited).toBe(false);
    });
  });

  describe('updateContent', () => {
    it('should update content and set updatedAt', () => {
      const message = createMessage();
      const now = new Date('2024-01-01T10:05:00');

      message.updateContent('Updated content', now);

      expect(message.content).toBe('Updated content');
      expect(message.updatedAt).toEqual(now);
      expect(message.isEdited).toBe(true);
    });

    it('should throw error for empty content', () => {
      const message = createMessage();
      const now = new Date();

      expect(() => message.updateContent('', now)).toThrow(ValidationError);
      expect(() => message.updateContent('', now)).toThrow('content: cannot be empty');
      expect(() => message.updateContent('   ', now)).toThrow(ValidationError);
      expect(() => message.updateContent('   ', now)).toThrow('content: cannot be empty');
    });

    it('should trim content', () => {
      const message = createMessage();
      const now = new Date();

      message.updateContent('  Trimmed content  ', now);

      expect(message.content).toBe('Trimmed content');
    });
  });

  describe('canEdit', () => {
    it('should allow edit by same user within 5 minutes', () => {
      const createdAt = new Date('2024-01-01T10:00:00');
      const message = createMessage(createdAt);
      const userId = toUserId('user-1');

      // 1 minute later
      const now1 = new Date('2024-01-01T10:01:00');
      expect(message.canEdit(userId, now1)).toBe(true);

      // 4 minutes later
      const now2 = new Date('2024-01-01T10:04:00');
      expect(message.canEdit(userId, now2)).toBe(true);
    });

    it('should not allow edit after 5 minutes', () => {
      const createdAt = new Date('2024-01-01T10:00:00');
      const message = createMessage(createdAt);
      const userId = toUserId('user-1');

      // 5 minutes later
      const now1 = new Date('2024-01-01T10:05:00');
      expect(message.canEdit(userId, now1)).toBe(false);

      // 6 minutes later
      const now2 = new Date('2024-01-01T10:06:00');
      expect(message.canEdit(userId, now2)).toBe(false);
    });

    it('should not allow edit by different user', () => {
      const createdAt = new Date('2024-01-01T10:00:00');
      const message = createMessage(createdAt);
      const differentUserId = toUserId('user-2');

      // Even immediately after creation
      const now = new Date('2024-01-01T10:00:01');
      expect(message.canEdit(differentUserId, now)).toBe(false);
    });
  });

  describe('isEdited', () => {
    it('should return false for new message', () => {
      const message = createMessage();
      expect(message.isEdited).toBe(false);
    });

    it('should return true after update', () => {
      const message = createMessage();
      message.updateContent('Updated', new Date());
      expect(message.isEdited).toBe(true);
    });
  });
});
