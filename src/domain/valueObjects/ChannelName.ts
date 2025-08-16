import { ValueObject } from './ValueObject';
import { ValidationError } from '../errors/ValidationError';

export class ChannelName extends ValueObject<string> {
  private static readonly CHANNEL_NAME_REGEX = /^[a-zA-Z0-9-_]+$/;

  constructor(value: string) {
    super(value.trim());
  }

  protected validate(value: string): void {
    if (!value || value.length === 0) {
      throw new ValidationError('name', 'cannot be empty');
    }
    if (!ChannelName.CHANNEL_NAME_REGEX.test(value)) {
      throw new ValidationError(
        'name',
        'can only contain letters, numbers, hyphens, and underscores',
      );
    }
  }

  static create(value: string): ChannelName {
    return new ChannelName(value);
  }
}
