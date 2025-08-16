import { toUserId } from '@/domain/valueObjects/UserId';
import { ValidationError } from '@/domain/errors/ValidationError';

describe('UserId', () => {
  describe('toUserId', () => {
    it('should create a valid UserId', () => {
      const userId = toUserId('user-123');
      expect(userId).toBe('user-123');
    });

    it('should throw error for empty string', () => {
      expect(() => toUserId('')).toThrow(ValidationError);
      expect(() => toUserId('')).toThrow('userId: cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => toUserId('   ')).toThrow(ValidationError);
      expect(() => toUserId('   ')).toThrow('userId: cannot be empty');
    });

    it('should accept various valid formats', () => {
      const validIds = ['123', 'user-123', 'USER_456', 'abc-def-ghi'];

      validIds.forEach((id) => {
        expect(() => toUserId(id)).not.toThrow();
      });
    });
  });
});
