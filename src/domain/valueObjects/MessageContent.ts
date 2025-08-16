import { ValueObject } from './ValueObject';
import { ValidationError } from '../errors/ValidationError';

export class MessageContent extends ValueObject<string> {
  constructor(value: string) {
    super(value.trim());
  }

  protected validate(value: string): void {
    if (!value || value.length === 0) {
      throw new ValidationError('content', 'cannot be empty');
    }
  }

  static create(value: string): MessageContent {
    return new MessageContent(value);
  }
}
