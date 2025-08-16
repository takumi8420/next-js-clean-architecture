import { Channel } from '@/domain/entities/Channel';
import { toChannelId } from '@/domain/valueObjects/ChannelId';
import { ValidationError } from '@/domain/errors/ValidationError';

describe('Channel', () => {
  const createChannel = () => {
    return new Channel(
      toChannelId('channel-1'),
      'general',
      'General discussion',
      false,
      new Date('2024-01-01'),
    );
  };

  describe('constructor', () => {
    it('should create a channel with all properties', () => {
      const channel = createChannel();

      expect(channel.id).toBe('channel-1');
      expect(channel.name).toBe('general');
      expect(channel.description).toBe('General discussion');
      expect(channel.isPrivate).toBe(false);
      expect(channel.createdAt).toEqual(new Date('2024-01-01'));
    });
  });

  describe('updateName', () => {
    it('should update the name with valid format', () => {
      const channel = createChannel();
      channel.updateName('new-channel-name');

      expect(channel.name).toBe('new-channel-name');
    });

    it('should throw error for empty name', () => {
      const channel = createChannel();

      expect(() => channel.updateName('')).toThrow(ValidationError);
      expect(() => channel.updateName('')).toThrow('name: cannot be empty');
      expect(() => channel.updateName('   ')).toThrow(ValidationError);
      expect(() => channel.updateName('   ')).toThrow('name: cannot be empty');
    });

    it('should throw error for invalid characters', () => {
      const channel = createChannel();

      expect(() => channel.updateName('channel name')).toThrow(ValidationError);
      expect(() => channel.updateName('channel name')).toThrow(
        'name: can only contain letters, numbers, hyphens, and underscores',
      );
      expect(() => channel.updateName('channel@name')).toThrow(ValidationError);
      expect(() => channel.updateName('channel@name')).toThrow(
        'name: can only contain letters, numbers, hyphens, and underscores',
      );
      expect(() => channel.updateName('channel!name')).toThrow(ValidationError);
      expect(() => channel.updateName('channel!name')).toThrow(
        'name: can only contain letters, numbers, hyphens, and underscores',
      );
    });

    it('should accept valid channel names', () => {
      const channel = createChannel();
      const validNames = ['channel', 'channel123', 'channel-name', 'channel_name', 'CHANNEL'];

      validNames.forEach((name) => {
        expect(() => channel.updateName(name)).not.toThrow();
      });
    });
  });

  describe('updateDescription', () => {
    it('should update the description', () => {
      const channel = createChannel();
      channel.updateDescription('New description');

      expect(channel.description).toBe('New description');
    });

    it('should accept empty description', () => {
      const channel = createChannel();
      channel.updateDescription('');

      expect(channel.description).toBe('');
    });
  });
});
