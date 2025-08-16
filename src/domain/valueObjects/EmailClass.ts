import { ValueObject } from './ValueObject';
import { ValidationError } from '../errors/ValidationError';

export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (!Email.EMAIL_REGEX.test(value)) {
      throw new ValidationError('email', 'invalid format');
    }
  }

  static create(value: string): Email {
    return new Email(value);
  }
}
