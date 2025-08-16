import { Email } from '@/domain/valueObjects/Email';
import { ValidationError } from '@/domain/errors/ValidationError';

describe('Email', () => {
  describe('constructor', () => {
    it('should create a valid email', () => {
      const email = new Email('test@example.com');
      expect(email.toString()).toBe('test@example.com');
    });

    it('should throw error for invalid email format', () => {
      expect(() => new Email('invalid')).toThrow(ValidationError);
      expect(() => new Email('invalid')).toThrow('email: invalid format');
      expect(() => new Email('invalid@')).toThrow(ValidationError);
      expect(() => new Email('invalid@')).toThrow('email: invalid format');
      expect(() => new Email('@example.com')).toThrow(ValidationError);
      expect(() => new Email('@example.com')).toThrow('email: invalid format');
      expect(() => new Email('test@')).toThrow(ValidationError);
      expect(() => new Email('test@')).toThrow('email: invalid format');
      expect(() => new Email('')).toThrow(ValidationError);
      expect(() => new Email('')).toThrow('email: invalid format');
    });

    it('should accept various valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.jp',
        'user123@subdomain.example.com',
      ];

      validEmails.forEach((email) => {
        expect(() => new Email(email)).not.toThrow();
      });
    });
  });

  describe('toString', () => {
    it('should return the email value', () => {
      const email = new Email('test@example.com');
      expect(email.toString()).toBe('test@example.com');
    });
  });
});
