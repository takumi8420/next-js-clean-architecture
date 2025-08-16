import { toChannelId } from '@/domain/valueObjects/ChannelId';
import { ValidationError } from '@/domain/errors/ValidationError';

describe('ChannelId', () => {
  describe('toChannelId', () => {
    it('should create a valid ChannelId', () => {
      const channelId = toChannelId('channel-123');
      expect(channelId).toBe('channel-123');
    });

    it('should throw error for empty string', () => {
      expect(() => toChannelId('')).toThrow(ValidationError);
      expect(() => toChannelId('')).toThrow('channelId: cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => toChannelId('   ')).toThrow(ValidationError);
      expect(() => toChannelId('   ')).toThrow('channelId: cannot be empty');
    });

    it('should accept various valid formats', () => {
      const validIds = ['123', 'channel-123', 'CHANNEL_456', 'abc-def-ghi'];

      validIds.forEach((id) => {
        expect(() => toChannelId(id)).not.toThrow();
      });
    });
  });
});
