import { User } from '@/domain/entities/User';
import { Email } from '@/domain/valueObjects/Email';
import { toUserId } from '@/domain/valueObjects/UserId';
import { ValidationError } from '@/domain/errors/ValidationError';

describe('User', () => {
  const createUser = () => {
    return new User(
      toUserId('user-1'),
      new Email('test@example.com'),
      'Test User',
      'online',
      new Date(),
    );
  };

  describe('constructor', () => {
    it('should create a user with all properties', () => {
      const user = createUser();

      expect(user.id).toBe('user-1');
      expect(user.email.toString()).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.status).toBe('online');
    });
  });

  describe('updateName', () => {
    it('should update the name', () => {
      const user = createUser();
      user.updateName('Updated Name');

      expect(user.name).toBe('Updated Name');
    });

    it('should throw error for empty name', () => {
      const user = createUser();

      expect(() => user.updateName('')).toThrow(ValidationError);
      expect(() => user.updateName('')).toThrow('name: cannot be empty');
      expect(() => user.updateName('   ')).toThrow(ValidationError);
      expect(() => user.updateName('   ')).toThrow('name: cannot be empty');
    });
  });

  describe('updateStatus', () => {
    it('should update the status', () => {
      const user = createUser();

      user.updateStatus('away');
      expect(user.status).toBe('away');

      user.updateStatus('offline');
      expect(user.status).toBe('offline');

      user.updateStatus('online');
      expect(user.status).toBe('online');
    });
  });
});
