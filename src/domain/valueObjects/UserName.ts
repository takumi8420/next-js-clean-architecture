import { ValueObject } from './ValueObject';
import { ValidationError } from '../errors/ValidationError';

export class UserName extends ValueObject<string> {
  constructor(value: string) {
    super(value.trim());
  }

  protected validate(value: string): void {
    if (!value || value.length === 0) {
      throw new ValidationError('name', 'cannot be empty');
    }
  }

  static create(value: string): UserName {
    return new UserName(value);
  }
}
