import { toMessageId } from '@/domain/valueObjects/MessageId';
import { ValidationError } from '@/domain/errors/ValidationError';

describe('MessageId', () => {
  describe('toMessageId', () => {
    it('should create a valid MessageId', () => {
      const messageId = toMessageId('msg-123');
      expect(messageId).toBe('msg-123');
    });

    it('should throw error for empty string', () => {
      expect(() => toMessageId('')).toThrow(ValidationError);
      expect(() => toMessageId('')).toThrow('messageId: cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => toMessageId('   ')).toThrow(ValidationError);
      expect(() => toMessageId('   ')).toThrow('messageId: cannot be empty');
    });

    it('should accept various valid formats', () => {
      const validIds = ['123', 'msg-123', 'MESSAGE_456', 'abc-def-ghi'];

      validIds.forEach((id) => {
        expect(() => toMessageId(id)).not.toThrow();
      });
    });
  });
});
