import { ValueObject } from './ValueObject';
import { ValidationError } from '../errors/ValidationError';

export class MessageId extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('messageId', 'cannot be empty');
    }
  }

  static create(value: string): MessageId {
    return new MessageId(value);
  }
}
