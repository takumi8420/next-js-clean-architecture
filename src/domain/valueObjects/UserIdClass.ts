import { ValueObject } from './ValueObject';
import { ValidationError } from '../errors/ValidationError';

export class UserId extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('userId', 'cannot be empty');
    }
  }

  static create(value: string): UserId {
    return new UserId(value);
  }
}
